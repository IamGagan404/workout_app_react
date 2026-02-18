from django.db import models
import datetime


class BodyPart(models.Model):
    name = models.CharField(max_length=100,unique=True)
    
    class Meta:
        db_table = "body_part"
        ordering = ["name"]
    
    def __str__(self):
        return self.name

# Create your models here.
class Workout(models.Model):
    date = models.DateField(default=datetime.datetime.today())
    remark = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now=True)
    focus_body_parts = models.ManyToManyField(BodyPart,related_name="focused_workouts",blank=True)
    
    class Meta:     
        db_table = "workout"
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"Workout on {self.date}"
    

class Exercise(models.Model):
    name = models.CharField()
    body_parts = models.ManyToManyField(BodyPart,related_name="exercises",blank=True)
    
    class Meta:
        db_table = "exercise"
        ordering = ["name"]
    
    def __str__(self):
        return self.name

class WorkoutExercise(models.Model):
    workout = models.ForeignKey(
        Workout,
        on_delete=models.CASCADE,
        related_name="workout_exercises"
    )
    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.PROTECT,
        related_name="workout_instances"
    )
    order_index = models.PositiveIntegerField()
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = "workout_exercise"
        ordering = ["order_index"]
        unique_together = ("workout","order_index")
    
    def __str__(self):
        return f"{self.exercise.name} in {self.workout.date}"
    
class SetEntry(models.Model):
    workout_exercise = models.ForeignKey(
        WorkoutExercise,
        on_delete=models.CASCADE,
        related_name="sets"
    )
    set_number = models.PositiveIntegerField()
    weight = models.FloatField()
    reps = models.PositiveIntegerField()

    class Meta:
        db_table = "set_entry"
        ordering = ["set_number"]
        unique_together = ("workout_exercise", "set_number")

    def __str__(self):
        return (
            f"{self.workout_exercise.exercise.name} - "
            f"Set {self.set_number}: {self.weight}kg x {self.reps}"
        )
    
    
    
