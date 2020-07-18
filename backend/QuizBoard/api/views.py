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
from django.db.models import Max, Sum
from itertools import chain
from QuizBoard.models import Quiz, Question, Answer, Responses, QuizTakers, Justifications, Explaination
from .serializers import QuizSerializer, QuestionSerializer, AnswerSerializer, JustificationsSerializer, ExplainationSerializer, QuizListSerializer, QuizTakerSerializer, ResponseSerialzer, QuizTakerResponseSerializer, QuizWithoutFlagsSerializer

class QuizListView(ListAPIView):
    serializer_class = QuizListSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def get_queryset(self):
        queryset = Quiz.objects.order_by('-created')
        return queryset

    def get(self, request, *args, **kwargs):
        results = Quiz.objects.order_by('-created')
        output_serializer = QuizListSerializer(results, many=True)
        data = output_serializer.data[:]
        response = Response(data)
        return set_headers_to_response(response)


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
        response = Response(data)
        return set_headers_to_response(response)


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
        response = Response(data)
        return set_headers_to_response(response)


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
        response = Response(groupedQuiz)
        return set_headers_to_response(response)


class QuizScoresListView(ListAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def get(self, request, user):  
        groupedScores = QuizTakers.objects.values('user','user__username').annotate(totalScore=Sum('score')).order_by('-totalScore')[:10]
        lastQuizTaker = groupedScores[len(groupedScores)-1]
        groupedScores = list(groupedScores)
        while True:
            index = 0
            indexList =[]
            deleted = False
            for quizTaker in groupedScores:
                if lastQuizTaker['totalScore'] == quizTaker['totalScore']:
                    del groupedScores[index]
                    deleted = True
                index = index + 1
            if deleted==False:
                break
        tiedScoreUsers = QuizTakers.objects.values('user','user__username').annotate(totalScore=Sum('score')).filter(totalScore=lastQuizTaker['totalScore'])
        user = User.objects.get(id=user)
        userScore = QuizTakers.objects.filter(user=user).values('user','user__username').annotate(totalScore=Sum('score'))
        topQuizTakers = list(chain(groupedScores, tiedScoreUsers))
        scoreData = {'topQuizTakers':topQuizTakers, 'userScoreData':userScore}
        response = Response(scoreData)
        return set_headers_to_response(response)


class OverallScoresChartView(ListAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def get(self, request):  
        groupedScores = QuizTakers.objects.values('user').annotate(totalScore=Sum('score'))
        scoreData = {'groupedScores':groupedScores}
        response = Response(scoreData)
        return set_headers_to_response(response)


class UserScoresDetailsView(ListAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def get(self, request, user):  
        user = User.objects.get(id=user)
        userScore = QuizTakers.objects.filter(user=user).values('user', 'user__username').annotate(totalScore=Sum('score'))
        totalQuiz = Quiz.objects.count()
        quizzesAttempted = QuizTakers.objects.filter(user=user).values('user').annotate(quizattempted=Count('user'))
        scoreData = {'username':userScore[0]['user__username'], 'totalScore':userScore[0]['totalScore'], 'totalquiz':totalQuiz, 'quizattempted': quizzesAttempted[0]['quizattempted']}
        response = Response(scoreData)
        return set_headers_to_response(response)


class UserProgressView(ListAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def get(self, request, user):  
        user = User.objects.get(id=user)
        userScores = QuizTakers.objects.filter(user=user)
        allQuizPercentages = []
        for quizTaker in userScores:
            quiz = quizTaker.quiz
            quiz = Quiz.objects.get(id=quiz.id)
            questionCount = quiz.questions_count
            percentage = (quizTaker.score/(questionCount*10)) * 100
            score = {'quiz': quiz.id, 'percentage': percentage}
            allQuizPercentages.append(score)
        response = Response(allQuizPercentages)
        return set_headers_to_response(response)




def set_headers_to_response(response):
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response["Pragma"] = "no-cache"
    response["Expires"] = "0"
    return response
