from itertools import chain

from django.contrib.auth.models import User
from django.db.models import Count, Max, Sum
from QuizBoard.models import (Answer, Explaination, Justifications, Question,
                              Quiz, QuizTakers, Responses)
from rest_framework import permissions, viewsets
from rest_framework.views import APIView
from rest_framework.generics import (CreateAPIView, DestroyAPIView,
                                     ListAPIView, ListCreateAPIView,
                                     RetrieveAPIView, UpdateAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import (AnswerSerializer, ExplainationSerializer,
                          JustificationsSerializer, QuestionSerializer,
                          QuizListSerializer, QuizSerializer,
                          QuizTakerResponseSerializer, QuizTakerSerializer,
                          QuizWithoutFlagsSerializer, ResponseSerialzer, UserSerializer)
from django.db.models import FloatField
from django.db.models.functions import Cast
from QuizBoard.lib.quiz_parser import read_quiz
from django.core.files import File
from rest_framework import status


class QuizListView(ListAPIView):
    serializer_class = QuizListSerializer
    permission_classes = [permissions.IsAuthenticated, ]

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
    permission_classes = [permissions.IsAuthenticated, ]


class QuizCreateView(ListCreateAPIView):
    queryset = Quiz.objects.none()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        queryset = Quiz.objects.all()
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, many=isinstance(request.data, list))
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
    permission_classes = [permissions.IsAuthenticated, ]


class AnswerCreateView(CreateAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticated, ]


class JustificationsCreateView(CreateAPIView):
    queryset = Justifications.objects.all()
    serializer_class = JustificationsSerializer
    permission_classes = [permissions.IsAuthenticated, ]


class ExplainationsCreateView(CreateAPIView):
    queryset = Explaination.objects.all()
    serializer_class = ExplainationSerializer
    permission_classes = [permissions.IsAuthenticated, ]


class QuizTakerCreateView(ListCreateAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        queryset = QuizTakers.objects.all()
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, many=isinstance(request.data, list))
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
    permission_classes = [permissions.IsAuthenticated, ]


class ResponseCreateView(ListCreateAPIView):
    queryset = Responses.objects.none()
    serializer_class = ResponseSerialzer
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        queryset = Responses.objects.all()
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, many=isinstance(request.data, list))
        serializer.is_valid(raise_exception=True)
        todo_created = []
        for list_elt in request.data:
            list_elt['quiztaker'] = QuizTakers.objects.get(
                id=list_elt['quiztaker'])
            list_elt['question'] = Question.objects.get(
                id=list_elt['question'])
            list_elt['answer'] = Answer.objects.get(id=list_elt['answer'])
            list_elt['justification'] = Justifications.objects.get(
                id=list_elt['justification'])
            todo_obj = Responses.objects.create(**list_elt)
            todo_created.append(todo_obj.id)
        results = Responses.objects.filter(id__in=todo_created)
        output_serializer = ResponseSerialzer(results, many=True)
        data = output_serializer.data[:]
        response = Response(data)
        return set_headers_to_response(response)


class QuizTakerListView(ListAPIView):
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        user = self.kwargs['user']
        try:
            user = User.objects.get(id=user)
            queryset = QuizTakers.objects.filter(user=user)
        except (QuizTakers.DoesNotExist, Quiz.DoesNotExist, User.DoesNotExist):
            queryset = QuizTakers.objects.none()
        return queryset


class QuizTakerUpdateView(UpdateAPIView):
    queryset = QuizTakers.objects.all()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated, ]

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
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        queryset = Responses.objects.all()
        return queryset

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, many=isinstance(request.data, list))
        serializer.is_valid(raise_exception=True)
        todo_created = []
        responses = []
        for list_elt in request.data:
            qt = QuizTakers.objects.get(id=list_elt['quiztaker'])
            ques = Question.objects.get(id=list_elt['question'])
            # response = Responses.objects.filter(quiztaker=qt, question=ques)
            answers = Answer.objects.get(id=list_elt['answer'])
            justifications = Justifications.objects.get(
                id=list_elt['justification'])
            responses = Responses.objects.select_related().filter(
                quiztaker=qt, question=ques).update(answer=answers, justification=justifications)


class QuizWithoutFlagsRetrieveView(RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizWithoutFlagsSerializer
    permission_classes = [permissions.IsAuthenticated, ]


class QuizTakerHistoryListView(ListAPIView):
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        groupedQuiz = QuizTakers.objects.values('quiz', 'quiz__name').annotate(
            usersAttempted=Count('quiz')).annotate(highScore=Max('score'))
        response = Response(groupedQuiz)
        return set_headers_to_response(response)


class QuizScoresListView(ListAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request, user):
        user_score = getGroupedUserscores()
        all_scores = []
        user_score_sorted = {k: v for k, v in sorted(
            user_score.items(), key=lambda item: item[1], reverse=True)}
        for key, value in user_score_sorted.items():
            user_obj = User.objects.get(id=key)
            all_scores.append(
                {'user': key, 'user__username': user_obj.username, "totalScore": value})
        groupedScores = all_scores[:10]
        lastQuizTaker = groupedScores[len(groupedScores)-1]
        while True:
            index = 0
            indexList = []
            deleted = False
            for quizTaker in groupedScores:
                if lastQuizTaker['totalScore'] == quizTaker['totalScore']:
                    del groupedScores[index]
                    deleted = True
                index = index + 1
            if deleted == False:
                break
        tiedScoreUsers = [
            quizTaker for quizTaker in all_scores if quizTaker['totalScore'] == lastQuizTaker['totalScore']]
        userScore = [
            quizTaker for quizTaker in all_scores if quizTaker['user'] == user]
        topQuizTakers = list(chain(groupedScores, tiedScoreUsers))
        scoreData = {'topQuizTakers': topQuizTakers,
                     'userScoreData': userScore}
        response = Response(scoreData)
        return set_headers_to_response(response)


class OverallScoresChartView(ListAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        user_score = getGroupedUserscores()
        user_score_sorted = {k: v for k, v in sorted(
            user_score.items(), key=lambda item: item[1])}
        groupedScores = []
        for key, value in user_score_sorted.items():
            groupedScores.append({'user': key, "totalScore": value})
        scoreData = {'groupedScores': groupedScores}
        response = Response(scoreData)
        return set_headers_to_response(response)


class UserScoresDetailsView(ListAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request, user):
        user = User.objects.get(id=user)
        userScore = QuizTakers.objects.filter(user=user).values(
            'user', 'user__username').annotate(totalScore=Sum('score'))
        totalQuiz = Quiz.objects.count()
        quizzesAttempted = QuizTakers.objects.filter(user=user).values(
            'user').annotate(quizattempted=Count('user'))
        scoreData = {'username': userScore[0]['user__username'], 'totalScore': userScore[0]
                     ['totalScore'], 'totalquiz': totalQuiz, 'quizattempted': quizzesAttempted[0]['quizattempted']}
        response = Response(scoreData)
        return set_headers_to_response(response)


class UserProgressView(ListAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request, user):
        user = User.objects.get(id=user)
        userScores = QuizTakers.objects.filter(user=user).values(
            'quiz', 'score').order_by('quiz')
        allQuizPercentages = []
        quiz_set = set()
        for quizTaker in userScores:
            quiz = quizTaker['quiz']
            quiz = Quiz.objects.get(id=quiz)
            questionCount = quiz.questions_count
            percentage = (quizTaker['score']/(questionCount*10)) * 100
            if quiz.id not in quiz_set:
                score = {'quiz': quiz.id, 'percentage': percentage}
                allQuizPercentages.append(score)
                quiz_set.add(quiz.id)
        response = Response(allQuizPercentages)
        return set_headers_to_response(response)


class AllUserProgressView(ListAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        userAllQuizScores = QuizTakers.objects.all().order_by('quiz')
        allQuizPercentages = []
        quizPercentages = []
        prevQuizId = userAllQuizScores[0].quiz.id
        user_set = set()
        for quizTaker in userAllQuizScores:
            quiz = quizTaker.quiz
            if prevQuizId != quiz.id:
                allQuizPercentages.append(
                    {'quiz': prevQuizId, 'percentage': quizPercentages})
                quizPercentages = []
                prevQuizId = quiz.id
                user_set = set()
            quiz = Quiz.objects.get(id=quiz.id)
            questionCount = quiz.questions_count
            percentage = (quizTaker.score/(questionCount*10)) * 100
            if quizTaker.user not in user_set:
                quizPercentages.append(percentage)
                user_set.add(quizTaker.user)
        allQuizPercentages.append(
            {'quiz': prevQuizId, 'percentage': quizPercentages})
        response = Response(allQuizPercentages)
        return set_headers_to_response(response)


class AverageQuestionsSolvedView(ListAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        query_set = QuizTakers.objects.all().order_by('quiz')
        quiz_correct_ans = {}
        user_set = set()
        prev_quiz_id = query_set[0].quiz.id
        for quiz_taker in query_set:
            if prev_quiz_id != quiz_taker.quiz.id:
                quiz_correct_ans[prev_quiz_id] = quiz_correct_ans[prev_quiz_id] * \
                    1.0 / len(user_set) * 1.0
                prev_quiz_id = quiz_taker.quiz.id
                user_set = set()
            if quiz_taker.user.id not in user_set:
                if quiz_taker.quiz.id in quiz_correct_ans:
                    quiz_correct_ans[quiz_taker.quiz.id] = quiz_correct_ans[quiz_taker.quiz.id] + \
                        quiz_taker.correct_answers
                else:
                    quiz_correct_ans[quiz_taker.quiz.id] = quiz_taker.correct_answers
                user_set.add(quiz_taker.user.id)
        result = []
        for key, value in quiz_correct_ans.items():
            result.append({'quiz': key, "avg_ques_solved": value})
        response = Response(result)
        return set_headers_to_response(response)


class OverallAttemptsOverQuizChartView(ListAPIView):
    queryset = QuizTakers.objects.none()
    serializer_class = QuizTakerSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        groupedQuizzes = QuizTakers.objects.values('user').annotate(
            totalQuizzes=Count('quiz', distinct=True)).order_by('totalQuizzes')
        scoreData = {'groupedQuizzes': groupedQuizzes}
        response = Response(scoreData)
        return set_headers_to_response(response)


class TotalParticipantsView(ListAPIView):
    queryset = User.objects.none()
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        totalUsers = User.objects.count()
        response = Response({'totalUsers': totalUsers})
        return set_headers_to_response(response)


def set_headers_to_response(response):
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response["Pragma"] = "no-cache"
    response["Expires"] = "0"
    return response


def getGroupedUserscores():
    query_set = QuizTakers.objects.all().order_by('user')
    users_score = {}
    quiz_set = set()
    prev_user_id = query_set[0].user.id
    for quiz_taker in query_set:
        if prev_user_id != quiz_taker.user.id:
            prev_user_id = quiz_taker.user.id
            quiz_set = set()
        if quiz_taker.quiz.id not in quiz_set:
            if quiz_taker.user.id in users_score:
                users_score[quiz_taker.user.id] = users_score[quiz_taker.user.id] + \
                    quiz_taker.score
            else:
                users_score[quiz_taker.user.id] = quiz_taker.score
            quiz_set.add(quiz_taker.quiz.id)
    return users_score


class UserRetrieveView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, ]


class UploadQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        s = 'Upload quiz successful'
        try:
            file_content = request.FILES['file'].read()
            read_quiz(file_content.decode('utf-8'))
        except Exception as e:
            s = str(e)
            response = Response(s, status.HTTP_400_BAD_REQUEST)
            return response
        response = Response(s)
        return set_headers_to_response(response)
