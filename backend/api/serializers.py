from rest_framework import serializers
from .models import *
from drf_writable_nested import WritableNestedModelSerializer

class OptionQuestionSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = OptionQuestion
        fields = ('id', 'text', 'question')

class QuestionSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    options = OptionQuestionSerializer(source='optionquestion_set', many=True, read_only=False)
    class Meta:
        model = Question
        fields = ('id', 'text', 'type_question', 'quiz', 'options')

class QuizSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    questions = QuestionSerializer(source='question_set', many=True, read_only=False)
    class Meta:
        model = Quiz
        fields = ('id', 'name', 'description', 'date_created', 'date_updated', 'date_published', 'is_published', 'is_archived', 'is_locked', 'is_deleted', 'owner', 'shares', 'questions')

class AnswerSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    answer_option = OptionQuestionSerializer(many=False, read_only=False, required=False)
    question = QuestionSerializer(many=False, read_only=False, required=True)

    class Meta:
        model = Answer
        fields = ('id', 'question', 'answer_option', 'answer_text')

class ReportAnswerSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    answers = AnswerSerializer(source='answer_set', many=True, read_only=False)

    # def create(self, validated_data):
    #     answers_data = validated_data.pop('answer_set')
    #     report_answer = ReportAnswer.objects.create(**validated_data)

    #     for answer in answers_data:
    #         question = Question.objects.get(id=answer['question']['id'])
    #         if question.type_question == 'MCQ':
    #             answer_option = OptionQuestion.objects.get(id=answer['answer_option']['id'])
    #             answer = Answer.objects.create(report_answer=report_answer, question=question, answer_option=answer_option)
    #         else:
    #             answer = Answer.objects.create(report_answer=report_answer, question=question, answer_text=answer['answer_text'])
    #        # report_answer.answers.add(answer)
    #     return report_answer

    class Meta:
        model = ReportAnswer
        fields = ('id', 'user', 'quiz', 'answers', )


