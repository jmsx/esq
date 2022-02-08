from rest_framework import serializers
from .models import *
from drf_writable_nested import WritableNestedModelSerializer
from django.contrib.auth.models import User

class OptionQuestionSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = OptionQuestion
        fields = ('id', 'text')

class QuestionSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    options = OptionQuestionSerializer(source='optionquestion_set', many=True, read_only=False)
    class Meta:
        model = Question
        fields = ('id', 'text', 'type_question', 'options')

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

    class Meta:
        model = ReportAnswer
        fields = ('id', 'user', 'quiz', 'answers', )

class UserSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')


