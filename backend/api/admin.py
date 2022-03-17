from django.contrib import admin
from .models import *

admin.site.register(Question)
admin.site.register(QuestionMultipleChoice)
admin.site.register(QuestionShortAnswer)
admin.site.register(QuestionRange)

admin.site.register(OptionQuestionMultipleChoice)

admin.site.register(ReportAnswer)

admin.site.register(StadisticAnswer)

admin.site.register(Answer)
admin.site.register(AnswerMultipleChoice)
admin.site.register(AnswerShortAnswer)
admin.site.register(AnswerRange)

admin.site.register(Quiz)
