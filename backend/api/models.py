from django.db import models

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

class OptionQuestion(models.Model):
    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    text = models.CharField(max_length=200)

    def __str__(self):
        return self.text

class Question(models.Model):
    text = models.CharField(max_length=200)
    type_question = models.CharField(max_length=200, choices=[('MCQ', 'Multiple Choice'), ('SA', 'Short Answer')])
    quiz = models.ForeignKey('Quiz', on_delete=models.CASCADE)

    def __str__(self):
        return self.text

class ReportAnswer(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    quiz = models.ForeignKey('Quiz', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user) + ' - ' + str(self.quiz)

class Answer(models.Model):
    report_answer = models.ForeignKey('ReportAnswer', on_delete=models.CASCADE)
    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    answer_option = models.ForeignKey('OptionQuestion', on_delete=models.CASCADE)
    answer_text = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return str(self.question)