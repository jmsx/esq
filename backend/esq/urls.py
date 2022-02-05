from api import views
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls

router = DefaultRouter()

router.register(r'quiz', views.QuizViewSet)
router.register(r'question', views.QuestionViewSet)
router.register(r'optionquestion', views.OptionQuestionViewSet)
router.register(r'reportanswer', views.ReportAnswerViewSet)
router.register(r'answer', views.AnswerViewSet)

admin.site.site_header = "Easy Statdistics Quiz ADMIN"
admin.site.site_title = "Easy Statdistics Quiz ADMIN"
admin.site.index_title = "Welcome to Easy Statdistics Quiz Portal"


schema_view = get_schema_view(title='Easy Statdistics Quiz API',
                description='Easy Statdistics Quiz.')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('schema/', schema_view),
    path('docs/', include_docs_urls(title='Easy Statdistics Quiz API'))
]