from rest_framework import serializers
from .models import Workout,WorkoutExercise,SetEntry,BodyPart



class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = "__all__"

class SetEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SetEntry
        fields = "__all__"

class BodyPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyPart
        fields = "__all__"       

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    sets = SetEntrySerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutExercise
        fields = [
            "id",
            "order_index",
            "notes",
            "exercise",
            "sets",
        ]
class WorkoutSerializer(serializers.ModelSerializer):
    workout_exercises = WorkoutExerciseSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Workout
        fields = [
            "id",
            "date",
            "remark",
            "focus_body_parts",
            "workout_exercises",
        ]