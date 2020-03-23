from rest_framework import permissions, viewsets
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView,
    ListCreateAPIView,
)
from QuizBoard.models import Quiz, Question, Answer, Response, QuizTakers, Justifications
from .serializers import QuizSerializer, QuestionSerializer, AnswerSerializer, JustificationsSerializer

class QuizListView(ListAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer


class QuizRetrieveView(RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer


class QuizCreateView(ListCreateAPIView):
    queryset = Quiz.objects.none()
    serializer_class = QuizSerializer

    def get_queryset(self):
        queryset = Quiz.objects.all()
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
        serializer.is_valid(raise_exception=True)
        todo_created = []
        for list_elt in request.data:
            todo_obj = Quiz.objects.create(**list_elt)
            todo_created.append(todo_obj.id)
        results = Quiz.objects.filter(id__in=todo_created)
        output_serializer = QuizSerializer(results, many=True)
        data = output_serializer.data[:]
        return Response(data)


class QuestionCreateView(CreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class AnswerCreateView(CreateAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class JustificationsCreateView(CreateAPIView):
    queryset = Justifications.objects.all()
    serializer_class = JustificationsSerializer