from .models import *
from .serializers import *

from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q

import io
from django.http import HttpResponse
import xlsxwriter


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def get_queryset(self):
        user = self.request.user
        if user is not None and user.is_authenticated:  
            res = Quiz.objects.filter(
                Q(
                    Q(owner=user.id) | Q(shares=user.id)
                )
            )

            res = list(dict.fromkeys(res))
            return res
        else:
            return Quiz.objects.none()

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionPolymorphicSerializer

class ReportAnswerViewSet(viewsets.ModelViewSet):
    serializer_class = ReportAnswerSerializer

    def get_queryset(self):
        user = self.request.user
        quiz_id = self.request.query_params.get('quiz', None)
        if quiz_id is not None:
            return ReportAnswer.objects.filter(
                Q(quiz=quiz_id) & Q(Q(user=user) | Q(quiz__owner=user))
            )
        else:
            return ReportAnswer.objects.filter(Q(Q(user=user) | Q(quiz__owner=user)))


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerPolymorphicSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class StadisticAnswerView(viewsets.ModelViewSet):
    queryset = StadisticAnswer.objects.all()
    serializer_class = StadisticAnswerSerializer


class DataExport(APIView):

    def add_data_to_matrix(self, data, answer):
        if answer.question.id in data.keys():
            data[answer.question.id]['data'].append(answer.get_value())
        else:
            data[answer.question.id] = {
                'question': answer.question.text,
                'data': [answer.get_value()]
            }

    def get_report_data_by_quiz(self, user, quiz_id):
        data = dict()
        reports = ReportAnswer.objects.filter(
            Q(quiz=quiz_id) &  Q(quiz__owner=user)
        )

        for report in reports:
            for answers in Answer.objects.filter(report_answer=report):
                try:
                    for answer in answers:
                        self.add_data_to_matrix( data, answer)
                except:
                    self.add_data_to_matrix( data, answers)

        
        
        return data
        

    def get(self, request, format=None):

        # Create an in-memory output file for the new workbook.
        output = io.BytesIO()

        # Even though the final file will be in memory the module uses temp
        # files during assembly for efficiency. To avoid this on servers that
        # don't allow temp files, for example the Google APP Engine, set the
        # 'in_memory' Workbook() constructor option as shown in the docs.
        workbook = xlsxwriter.Workbook(output)
        worksheet = workbook.add_worksheet()

        # Get some data to write to the spreadsheet.
        quiz_id = request.GET.get('quiz', None)
        data = self.get_report_data_by_quiz(request.user ,quiz_id)

        # Write some test data.
        for colum, q in  enumerate(data.keys()):
            worksheet.write(0, colum, data[q]['question'])
            for file, a in enumerate(data[q]['data']):
                worksheet.write(file + 1, colum, a)


        # Close the workbook before sending the data.
        workbook.close()

        # Rewind the buffer.
        output.seek(0)

        # Set up the Http response.
        filename = 'data-quiz-' + quiz_id + '.xlsx'
        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=%s' % filename

        return response