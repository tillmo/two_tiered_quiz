from django.contrib import admin
import nested_admin
from .models import Quiz, Question, Answer, Response, QuizTakers, Justifications, Explaination

class ExplainationInline(nested_admin.NestedTabularInline):
 model = Explaination
 extra = 1
 max_num = 1


class JustificationInline(nested_admin.NestedTabularInline):
 model = Justifications
 extra = 4
 max_num = 4
 inlines = [ExplainationInline,]


class AnswerInline(nested_admin.NestedTabularInline):
 model = Answer
 extra = 4
 max_num = 2
 inlines = [JustificationInline,]


class QuestionInline(nested_admin.NestedTabularInline):
 model = Question
 inlines = [AnswerInline,]


class QuizAdmin(nested_admin.NestedModelAdmin):
 inlines = [QuestionInline,]


class ResponseInline(admin.TabularInline):
 model = Response


class QuizTakersAdmin(admin.ModelAdmin):
 inlines = [ResponseInline,]

 
admin.site.register(Quiz, QuizAdmin)
admin.site.register(QuizTakers, QuizTakersAdmin)
admin.site.register(Response)
