from api import views
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls
from rest_framework_simplejwt import views as jwt_views

router = DefaultRouter()

router.register(r'quiz', views.QuizViewSet, basename='quiz')
router.register(r'reportanswer', views.ReportAnswerViewSet, basename='reportanswer')
router.register(r'user', views.UserViewSet)

admin.site.site_header = "Easy Statdistics Quiz ADMIN"
admin.site.site_title = "Easy Statdistics Quiz ADMIN"
admin.site.index_title = "Welcome to Easy Statdistics Quiz Portal"


schema_view = get_schema_view(title='Easy Statdistics Quiz API',
                description='Easy Statdistics Quiz.')
urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),

    # API
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),

    # Documentation
    path('schema/', schema_view),
    path('docs/', include_docs_urls(title='Easy Statdistics Quiz API'))
]