from django.contrib import admin
from .models import Workout,Exercise,WorkoutExercise,SetEntry,BodyPart
# Register your models here.

admin.site.register(Workout)
admin.site.register(Exercise)
admin.site.register(WorkoutExercise)
admin.site.register(SetEntry)
admin.site.register(BodyPart)
