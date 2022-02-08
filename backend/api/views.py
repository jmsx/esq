from .models import *
from .serializers import *

from rest_framework import status, viewsets
from rest_framework.response import Response
from django.contrib.auth.models import User


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

class OptionQuestionViewSet(viewsets.ModelViewSet):
    queryset = OptionQuestion.objects.all()
    serializer_class = OptionQuestionSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class ReportAnswerViewSet(viewsets.ModelViewSet):
    queryset = ReportAnswer.objects.all()
    serializer_class = ReportAnswerSerializer

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
