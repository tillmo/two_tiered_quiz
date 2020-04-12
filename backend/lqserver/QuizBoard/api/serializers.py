from rest_framework import serializers

from QuizBoard.models import Quiz, Question, Answer, Responses, QuizTakers, Justifications, Explaination

class ExplainationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Explaination
        fields = '__all__'


class JustificationsSerializer(serializers.ModelSerializer):
    explaination = serializers.SerializerMethodField()
    class Meta:
        model = Justifications
        fields = '__all__'

    def get_explaination(self, obj):
        return [ExplainationSerializer(s).data for s in obj.explaination_set.all()]
    


class AnswerSerializer(serializers.ModelSerializer):
    justifications = serializers.SerializerMethodField()
    class Meta:
        model = Answer
        fields = '__all__'

    def get_justifications(self, obj):
        return [JustificationsSerializer(s).data for s in obj.justifications_set.all()]


class QuestionSerializer(serializers.ModelSerializer):
    answer = serializers.SerializerMethodField()
    class Meta:
        model = Question
        fields = '__all__'

    def get_answer(self, obj):
        return [AnswerSerializer(s).data for s in obj.answer_set.all()]


class QuizSerializer(serializers.ModelSerializer):  
    question = serializers.SerializerMethodField() 

    class Meta:
        model = Quiz
        fields = '__all__'

    def get_question(self, obj):
        return [QuestionSerializer(s).data for s in obj.question_set.all()]



class QuizListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'


class ResponseSerialzer(serializers.ModelSerializer):
    class Meta:
        model = Responses
        fields = '__all__'


class QuizTakerResponseSerializer(serializers.ModelSerializer):
    responses = serializers.SerializerMethodField() 

    class Meta:
            model = QuizTakers
            fields = '__all__'

    def get_responses(self, obj):
        return [ResponseSerialzer(s).data for s in obj.responses_set.all()]


class QuizTakerSerializer(serializers.ModelSerializer):
    
    class Meta:
            model = QuizTakers
            fields = '__all__'
