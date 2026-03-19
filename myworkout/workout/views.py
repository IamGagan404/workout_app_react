
# from django.shortcuts import render, redirect, get_object_or_404
# from .models import Workout, WorkoutExercise, SetEntry
# from django import forms
# from .forms import WorkoutExcerciseForm, SetEntryForm, SetEntryFormSet
# from django.db import transaction
# from django.db.models import Max
# # Create your views here.


# class WorkoutForm(forms.ModelForm):
#     class Meta:
#         model = Workout
#         fields = ["date","remark","focus_body_parts"]
        
# def create_workout(request):
#     if request.method == "POST":
#         form = WorkoutForm(request.POST)
#         if form.is_valid():
#             workout = form.save()
#             return redirect("workout_detail",pk=workout.pk)
#     else:
#         form = WorkoutForm()
        
#     return render(request, "workout/create_workout.html", {"form": form})

# def workout_detail(request, pk):
#     workout = get_object_or_404(Workout, pk=pk)
#     exercises = workout.workout_exercises.all()

#     if request.method == "POST":
#         form = WorkoutExcerciseForm(request.POST)
#         if form.is_valid():
#             workout_exercise = form.save(commit=False)  # here object is not complete hence commit=False
#             workout_exercise.workout = workout    # attach workout to the object then save
#             last_exercise = workout.workout_exercises.order_by("-order_index").first()
#             if last_exercise:
#                 workout_exercise.order_index = last_exercise.order_index + 1
#             else:
#                 workout_exercise.order_index = 1
            
#             workout_exercise.save()
#     else:
#         form = WorkoutExcerciseForm()

#     return render(request, "workout/workout_detail.html", 
#                   {"workout": workout,
#                    "exercises":exercises,   
#                    "form":form
#                    }
#                 )

# @transaction.atomic
# def delete_workout(request, pk):
#     workout_exercise = get_object_or_404(WorkoutExercise,pk=pk)
#     workout = workout_exercise.workout

#     workout_exercise.delete()

#     remaining = workout.workout_exercises.order_by("order_index")

#     for index, we in enumerate(remaining,start=1):
#         if we.order_index != index:
#             we.order_index = index
#             we.save(update_fields=['order_index'])
    
#     return redirect("workout_detail",pk=workout.pk)
        
# def add_set_entry(request,pk):
#     workout_exercise = get_object_or_404(WorkoutExercise,pk=pk)
#     workout = workout_exercise.workout

#     if request.method == "POST":
#         form = SetEntryForm(request.POST)
#         if form.is_valid():
#             set_entry = form.save(commit=False)
#             set_entry.workout_exercise = workout_exercise

#             # auto set number
#             max_set = workout_exercise.sets.aggregate(Max("set_number"))["set_number__max"]
#             set_entry.set_number = (max_set or 0) + 1
#             set_entry.save()
#             return redirect("workout_detail",pk=workout.pk)
#     else:
#         form = SetEntryForm()
#     return render(request,"workout/add_sets.html",{
#         "form":form,
#         "workout_exercise":workout_exercise
#     }) 

# @transaction.atomic
# def delete_set_entry(request,pk):
#     set_entry = get_object_or_404(SetEntry,pk=pk)
#     workout_exercise = set_entry.workout_exercise
#     workout = workout_exercise.workout

#     set_entry.delete()

#     remaining = workout_exercise.sets.order_by("set_number")

#     for index,s in enumerate(remaining,start=1):
#         if s.set_number != index:
#             s.set_number = index
#             s.save(update_fields=["set_number"])
    
#     return redirect("workout_detail",pk=workout.pk)

# def workout_summery(request,pk):
#     workout = get_object_or_404(Workout,pk=pk)
#     workout_exercises = workout.workout_exercises.all()
#     return render(request,'workout/workout_summery.html',{
#         'workout':workout,
#         'exercises':workout_exercises
#     })

# def workout_list(request):
#     workouts = Workout.objects.all()
#     return render(request,'workout/workout_list.html',{
#         "workouts":workouts
#     })

# @transaction.atomic
# def manage_sets(request,pk):
#     workout_exercise = get_object_or_404(WorkoutExercise,pk=pk)
#     workout = workout_exercise.workout
#     print(workout.pk)

#     if request.method == "POST":
#         formset = SetEntryFormSet(request.POST, instance=workout_exercise)

#         if formset.is_valid():
#             # Don't save directly — we need control
#             instances = formset.save(commit=False)

#             # Delete checked objects first
#             # for obj in formset.deleted_objects:
#                 # obj.delete()

#             current_max = (
#                 workout_exercise.sets.aggregate(
#                     Max("set_number")
#                 )["set_number__max"] or 0
#             )

#             # Save new and updated objects
#             for instance in instances:
#                 if instance.pk is None:
#                     # New object → assign next set_number
#                     current_max += 1
#                     instance.set_number = current_max

#                 instance.workout_exercise = workout_exercise
#                 instance.save()


#             #reordering
#             sets = workout_exercise.sets.order_by("id")
#             for index,s in enumerate(sets,start=1):
#                 if index != s.set_number:
#                     s.set_number = index
#                     s.save(update_fields=["set_number"])
#             return redirect('workout_detail',pk=workout.pk)
#         else:
#             print("forminvalid")
#     else:
#         print("hwe")
#         formset = SetEntryFormSet(instance=workout_exercise)
#     return render(request,'workout/manage_sets.html',{
#         'formset':formset,
#         'workout_exercise':workout_exercise
#     })


from rest_framework import viewsets
from .models import Workout, WorkoutExercise, SetEntry, BodyPart,Exercise
from .serializers import (
    WorkoutSerializer,
    WorkoutExerciseSerializer,
    SetEntrySerializer,
    BodyPartSerializer,
    ExerciseSerializer
)
from django.db.models import F


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = (
        Workout.objects
        .prefetch_related(
            "focus_body_parts",
            "workout_exercises__sets",
            "workout_exercises__exercise"
        )
        .all()
    )
    serializer_class = WorkoutSerializer


class WorkoutExerciseViewSet(viewsets.ModelViewSet):
    queryset = WorkoutExercise.objects.all()
    serializer_class = WorkoutExerciseSerializer


class SetEntryViewSet(viewsets.ModelViewSet):
    queryset = SetEntry.objects.all()
    serializer_class = SetEntrySerializer

    def perform_destroy(self, instance):
        workout_exercise = instance.workout_exercise
        deleted_number = instance.set_number
        instance.delete()

        workout_exercise.sets.filter(
            set_number__gt=deleted_number
        ).update(set_number=F("set_number") - 1)


class BodyPartViewSet(viewsets.ModelViewSet):
    queryset = BodyPart.objects.all()
    serializer_class = BodyPartSerializer

class ExcerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer







