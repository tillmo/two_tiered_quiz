from django.contrib.auth.models import User
from rest_framework import permissions, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView,
    ListCreateAPIView,
)
from django.db.models import Count
from django.db.models import Max
from QuizBoard.models import Quiz, Question, Answer, Responses, QuizTakers, Justifications, Explaination
from .serializers import QuizSerializer, QuestionSerializer, AnswerSerializer, JustificationsSerializer, ExplainationSerializer, QuizListSerializer, QuizTakerSerializer, ResponseSerialzer, QuizTakerResponseSerializer, QuizWithoutFlagsSerializer

class QuizListView(ListAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizListSerializer
    permission_classes = [permissions.IsAuthenticated,]


class QuizRetrieveView(RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated,]


class QuizCreateView(ListCreateAPIView):
    queryset = Quiz.objects.none()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated,]

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
    permission_classes = [permissions.IsAuthenticated,]


class AnswerCreateView(CreateAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticated,]

class JustificationsCreateView(CreateAPIView):
    queryset = Justifications.objects.all()
    serializer_class = JustificationsSerializer
    permission_classes = [permissions.IsAuthenticated,]

class ExplainationsCreateView(CreateAPIView):
    queryset = Explaination.objects.all()
    serializer_class = ExplainationSerializer
    permission_classes = [permissions.IsAuthenticated,]

class QuizTakerCreateView(ListCreateAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated,]
    
    def get_queryset(self):
        queryset = QuizTakers.objects.all()
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
        serializer.is_valid(raise_exception=True)
        todo_created = []
        for list_elt in request.data:
            list_elt['user'] = User.objects.get(id=list_elt['user'])
            list_elt['quiz'] = Quiz.objects.get(id=list_elt['quiz'])
            todo_obj = QuizTakers.objects.create(**list_elt)
            todo_created.append(todo_obj.id)
        results = QuizTakers.objects.filter(id__in=todo_created)
        output_serializer = QuizTakerSerializer(results, many=True)
        data = output_serializer.data[:]
        return Response(data)


class QuizTakerRetrieveView(RetrieveAPIView):
    queryset = QuizTakers.objects.all()
    serializer_class = QuizTakerResponseSerializer
    permission_classes = [permissions.IsAuthenticated,]


class ResponseCreateView(ListCreateAPIView):
    queryset = Responses.objects.none()
    serializer_class = ResponseSerialzer
    permission_classes = [permissions.IsAuthenticated,]

    def get_queryset(self):
        queryset = Responses.objects.all()
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
        serializer.is_valid(raise_exception=True)
        todo_created = []
        for list_elt in request.data:
            list_elt['quiztaker'] = QuizTakers.objects.get(id=list_elt['quiztaker'])
            list_elt['question'] = Question.objects.get(id=list_elt['question'])
            list_elt['answer'] = Answer.objects.get(id=list_elt['answer'])
            list_elt['justification'] = Justifications.objects.get(id=list_elt['justification'])
            todo_obj = Responses.objects.create(**list_elt)
            todo_created.append(todo_obj.id)
        results = Responses.objects.filter(id__in=todo_created)
        output_serializer = ResponseSerialzer(results, many=True)
        data = output_serializer.data[:]
        return Response(data)


class QuizTakerListView(ListAPIView):
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def get_queryset(self):
        user = self.kwargs['user']
        try:
            user = User.objects.get(id=user)
            queryset = QuizTakers.objects.filter(user=user)
        except (QuizTakers.DoesNotExist,Quiz.DoesNotExist,User.DoesNotExist):
            queryset = QuizTakers.objects.none()
        return queryset


class QuizTakerUpdateView(UpdateAPIView):
    queryset = QuizTakers.objects.all()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated,]

    # def update(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     for list_elt in request.data:   
    #         instance.correct_answers = list_elt['correct_answers']
    #         instance.save()
    #     serializer = self.get_serializer(instance)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)
    #     return Response(serializer.data)


class ResponsesUpdateView(UpdateAPIView):
    queryset = Responses.objects.none()
    serializer_class = ResponseSerialzer
    permission_classes = [permissions.IsAuthenticated,]

    def get_queryset(self):
        queryset = Responses.objects.all()
        return queryset

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
        serializer.is_valid(raise_exception=True)
        todo_created = []
        responses= []
        for list_elt in request.data: 
            qt = QuizTakers.objects.get(id=list_elt['quiztaker'])  
            ques = Question.objects.get(id=list_elt['question'])
            # response = Responses.objects.filter(quiztaker=qt, question=ques)
            answers = Answer.objects.get(id=list_elt['answer'])
            justifications = Justifications.objects.get(id=list_elt['justification'])
            responses = Responses.objects.select_related().filter(quiztaker=qt, question=ques).update(answer=answers, justification = justifications)


class QuizWithoutFlagsRetrieveView(RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizWithoutFlagsSerializer
    permission_classes = [permissions.IsAuthenticated,]


class QuizTakerHistoryListView(ListAPIView):
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def get(self, request): 
        groupedQuiz = QuizTakers.objects.values('quiz','quiz__name').annotate(usersAttempted=Count('quiz')).annotate(highScore=Max('score'))
        return Response(groupedQuiz)


class QuizScoresListView(ListAPIView):
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def get(self, request, quiz): 
        qt = Quiz.objects.get(id=quiz)  
        groupedQuiz = QuizTakers.objects.filter(quiz=qt).values('quiz','user','quiz__name','score','user__username', 'completed')
        return Response(groupedQuiz)
       