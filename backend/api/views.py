from .models import *
from .serializers import *

from rest_framework import status, viewsets
from rest_framework.response import Response
from django.contrib.auth.models import User


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionPolymorphicSerializer

class ReportAnswerViewSet(viewsets.ModelViewSet):
    serializer_class = ReportAnswerSerializer

    def get_queryset(self):
        quiz_id = self.request.query_params.get('quiz', None)
        if quiz_id is not None:
            return ReportAnswer.objects.filter(quiz=quiz_id)
        else:
            return ReportAnswer.objects.all()


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerPolymorphicSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
