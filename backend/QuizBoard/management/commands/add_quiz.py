from django.core.management.base import BaseCommand, CommandError
from QuizBoard.lib.quiz_parser import read_quiz_file

class Command(BaseCommand):
    help = 'Adds quizzes to the database'

    def add_arguments(self, parser):
        parser.add_argument('file', type=str, help='Name of file with quizzes')

    def handle(self, *args, **kwargs):
        read_quiz_file(kwargs['file'])
