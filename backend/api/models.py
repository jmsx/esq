from django.db import models
from polymorphic.models import PolymorphicModel




def NON_POLYMORPHIC_CASCADE(collector, field, sub_objs, using):
    return models.CASCADE(collector, field, sub_objs.non_polymorphic(), using)

# Data models for Quiz and Question
class Quiz(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(null=True, blank=True)
    is_published = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    owner = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    shares = models.ManyToManyField('auth.User', related_name='quiz_shares', blank=True)


    def __str__(self):
        return self.name

class OptionQuestionMultipleChoice(PolymorphicModel):
    question = models.ForeignKey('QuestionMultipleChoice', on_delete=NON_POLYMORPHIC_CASCADE, related_name='options')
    text = models.CharField(max_length=200)

    def __str__(self):
        return self.text



class Question(PolymorphicModel):

    QUESTION_TYPES = [
        ('MCQ', 'Multiple Choice'),
        ('SA', 'Short Answer'),
        ('RQ', 'Range Question'),
    ]

    text = models.CharField(max_length=200)
    type_question = models.CharField(max_length=200, choices=QUESTION_TYPES)
    quiz = models.ForeignKey('Quiz', on_delete=NON_POLYMORPHIC_CASCADE)

    def __str__(self):
        return self.text

class QuestionMultipleChoice(Question):
    multiple = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class QuestionShortAnswer(Question):

    def __str__(self):
        return self.text

class QuestionRange(Question):
    min = models.IntegerField()
    max = models.IntegerField()

    def __str__(self):
        return self.text

class ReportAnswer(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    quiz = models.ForeignKey('Quiz', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user) + ' - ' + str(self.quiz)

class Answer(PolymorphicModel):
    report_answer = models.ForeignKey('ReportAnswer', on_delete=NON_POLYMORPHIC_CASCADE)
    question = models.ForeignKey('Question', on_delete=NON_POLYMORPHIC_CASCADE)

    def __str__(self):
        return str(self.question)

class AnswerMultipleChoice(Answer):
    answer_option = models.ForeignKey('OptionQuestionMultipleChoice', on_delete=NON_POLYMORPHIC_CASCADE)

    def __str__(self):
        return str(self.question)

class AnswerShortAnswer(Answer):
    value = models.CharField(max_length=200)

    def __str__(self):
        return str(self.question)

class AnswerRange(Answer):
    value = models.IntegerField()

    def __str__(self):
        return str(self.question)





def get_subclasses_as_choice(klass):
    choices = {subclass.__name__.lower(): subclass
               for subclass in klass.__subclasses__()}
    return choices


