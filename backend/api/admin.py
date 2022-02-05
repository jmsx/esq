from django.contrib import admin
from .models import *

admin.site.register(Question)
admin.site.register(OptionQuestion)
admin.site.register(ReportAnswer)
admin.site.register(Answer)
admin.site.register(Quiz)
