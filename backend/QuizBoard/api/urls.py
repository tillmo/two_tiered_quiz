from django.urls import path,include
from rest_framework.routers import DefaultRouter, SimpleRouter

from .views import (
    QuizListView, 
    QuizRetrieveView, 
    QuizCreateView, 
    QuestionCreateView, 
    AnswerCreateView,
    JustificationsCreateView,
    ExplainationsCreateView,
    QuizTakerCreateView,
    ResponseCreateView,
    QuizTakerRetrieveView,
    QuizTakerListView,
    QuizTakerUpdateView,
    ResponsesUpdateView,
    QuizWithoutFlagsRetrieveView,
    QuizTakerHistoryListView,
    QuizScoresListView
)

urlpatterns = [
    path('', QuizListView.as_view()),
    path('create/', QuizCreateView.as_view()),
    path('createquestion/', QuestionCreateView.as_view()),
    path('createanswer/', AnswerCreateView.as_view()),
    path('createjustification/', JustificationsCreateView.as_view()),
    path('createexplaination/', ExplainationsCreateView.as_view()),
    path('createreport/', QuizTakerCreateView.as_view()),
    path('createresponse/', ResponseCreateView.as_view()),
    path('getresponses/<pk>', QuizTakerRetrieveView.as_view()),
    path('getquiztaker/<int:user>/', QuizTakerListView.as_view()),
    path('updatequiztaker/<pk>', QuizTakerUpdateView.as_view()),
    path('updateresponses/', ResponsesUpdateView.as_view()),
    path('<pk>', QuizRetrieveView.as_view()),
    path('getquiz/<pk>', QuizWithoutFlagsRetrieveView.as_view()),
    path('getuserquizhistory/', QuizTakerHistoryListView.as_view()),
    path('getscorelist/<int:user>', QuizScoresListView.as_view()),
]