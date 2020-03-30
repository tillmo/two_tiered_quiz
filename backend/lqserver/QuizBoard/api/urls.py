from django.urls import path,include
from rest_framework.routers import DefaultRouter, SimpleRouter

from .views import (
    QuizListView, 
    QuizRetrieveView, 
    QuizCreateView, 
    QuestionCreateView, 
    AnswerCreateView,
    JustificationsCreateView,
    ExplainationsCreateView
)

urlpatterns = [
    path('', QuizListView.as_view()),
    path('create/', QuizCreateView.as_view()),
    path('createQuestion/', QuestionCreateView.as_view()),
    path('createAnswer/', AnswerCreateView.as_view()),
    path('createJustification/', JustificationsCreateView.as_view()),
    path('createExplaination/', ExplainationsCreateView.as_view()),
    path('<pk>', QuizRetrieveView.as_view()),
]