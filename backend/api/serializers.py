from rest_framework import serializers
from .models import *
from drf_writable_nested import WritableNestedModelSerializer
from django.contrib.auth.models import User
from rest_polymorphic.serializers import PolymorphicSerializer

class OptionQuestionMultipleChoiceSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = OptionQuestionMultipleChoice
        fields = ('id', 'text')

class QuestionMultipleChoiceSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    options = OptionQuestionMultipleChoiceSerializer( many=True, read_only=False)

    class Meta:
        model = QuestionMultipleChoice
        fields = ('id', 'type_question', 'text', 'options', 'multiple')

class QuestionShortAnswerSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = QuestionShortAnswer
        fields = ('id', 'type_question', 'text')

class QuestionRangeSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = QuestionRange
        fields = ('id', 'type_question', 'text', 'min', 'max')



class QuestionSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'type_question', 'text')




class AnswerMultipleChoiceSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    answer_option = OptionQuestionMultipleChoiceSerializer(many=False, read_only=False, required=False)
    question = QuestionSerializer(many=False, read_only=False, required=True)

    class Meta:
        model = AnswerMultipleChoice
        fields = ('id', 'question', 'answer_option')


class AnswerShortAnswerSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    question = QuestionSerializer(many=False, read_only=False, required=True)

    class Meta:
        model = AnswerShortAnswer
        fields = ('id', 'question', 'value')

class AnswerRangeSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    question = QuestionSerializer(many=False, read_only=False, required=True)

    class Meta:
        model = AnswerRange
        fields = ('id', 'question', 'value')


class AnswerSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    question = QuestionSerializer(many=False, read_only=False, required=True)
    class Meta:
        model = Answer
        fields = ('id', 'question')


class UserSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')



class QuestionPolymorphicSerializer(PolymorphicSerializer, WritableNestedModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

    model_serializer_mapping = {
        Question: QuestionSerializer,
        QuestionMultipleChoice: QuestionMultipleChoiceSerializer,
        QuestionShortAnswer: QuestionShortAnswerSerializer,
        QuestionRange: QuestionRangeSerializer,
    }

class AnswerPolymorphicSerializer(PolymorphicSerializer, WritableNestedModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
    model_serializer_mapping = {
        Answer: AnswerSerializer,
        AnswerMultipleChoice: AnswerMultipleChoiceSerializer,
        AnswerShortAnswer: AnswerShortAnswerSerializer,
        AnswerRange: AnswerRangeSerializer,
    }


class QuizSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    questions = QuestionPolymorphicSerializer(source='question_set', many=True, read_only=False)
    class Meta:
        model = Quiz
        fields = ('id', 'name', 'description', 'date_created', 'date_updated', 'date_published', 'is_published', 'is_archived', 'is_locked', 'is_deleted', 'owner', 'shares', 'questions')


class ReportAnswerSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    answers = AnswerPolymorphicSerializer(source='answer_set', many=True, read_only=False)

    class Meta:
        model = ReportAnswer
        fields = ('id', 'user', 'quiz', 'answers', )