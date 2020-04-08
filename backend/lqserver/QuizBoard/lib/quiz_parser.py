# Read in files with quizzes of the following form:
# quiz: name of quiz
# d: description of quiz
# q: question 1
# a: answer 1*
# j: justification 1
# e: explanation 1
# j: justification 2*
# a: answer 2
# ...
# q: question 2
# ...

from django.db import transaction
from QuizBoard.models import Quiz, Question, Answer, Response, QuizTakers, Justifications, Explaination

@transaction.atomic
def read_quiz(file):
    print('Reading {0} into database'.format(file))
    with open(file) as f:
        quiz = None
        question = None
        answer = None
        just = None
        try:
            for line in f:
                line = line.strip()
                if len(line)==0: # empty line
                    continue
                if line[0]=="#": # comment
                    continue
                prefix, contents = line.split(':', 1)
                if prefix=='quiz':
                    if Quiz.objects.filter(name=contents):
                        raise Exception("duplicate quiz")
                    quiz = Quiz.objects.create(name=contents)
                    # remove all contexts that have become invalid
                    question = None
                    answer = None
                    just = None
                elif prefix=='d':
                    quiz.description = contents
                    quiz.save()
                elif prefix=='q':
                    question = Question.objects.create(quiz=quiz,label=contents)
                    answer = None
                    just = None
                elif prefix=='a':
                    c = contents[-1]=="*"
                    if c:
                       contents  = contents[:-1]
                    answer = Answer.objects.create(question=question,text=contents,is_correct=c)
                    just = None
                elif prefix=='j':
                    c = contents[-1]=="*"
                    if c:
                       contents  = contents[:-1]
                    just = Justifications.objects.create(answer=answer,text=contents,is_correct=c)
                elif prefix=='e':
                    Explaination.objects.create(justification=just,text=contents)
                else:
                    print("Ignoring unknown prefix: {0}:\nUse quiz:, d:, q:, a:, j:, e:".format(prefix))
        except Exception as e:
            print("Wrong line: {0}".format(line))
            print(e)
            print("Aborting")

