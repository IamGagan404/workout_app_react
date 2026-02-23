from rest_framework import serializers
from .models import Workout,WorkoutExercise,SetEntry,BodyPart,Exercise
from django.db.models import Max



# class WorkoutExerciseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = WorkoutExercise
#         fields = "__all__"

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["id", "name"]

class SetEntrySerializer(serializers.ModelSerializer):

    class Meta:
        model = SetEntry
        fields = [
            "id",
            "workout_exercise",
            "set_number",
            "weight",
            "reps",
        ]
        read_only_fields = ["set_number"]

    def create(self, validated_data):
        workout_exercise = validated_data["workout_exercise"]

        max_number = (
            workout_exercise.sets.aggregate(
                Max("set_number")
            )["set_number__max"] or 0
        )

        validated_data["set_number"] = max_number + 1

        return super().create(validated_data)

class BodyPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyPart
        fields = ['id','name']      

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    # For GET (read)
    exercise = serializers.SerializerMethodField()

    # For POST (write)
    exercise_id = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all(),
        source="exercise",
        write_only=True
    )

    sets = SetEntrySerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutExercise
        fields = [
            "id",
            "order_index",
            "notes",
            "workout",
            "exercise",      # nested for read
            "exercise_id",   # id for write
            "sets",
        ]

    def get_exercise(self, obj):
        return {
            "id": obj.exercise.id,
            "name": obj.exercise.name
        }
class WorkoutSerializer(serializers.ModelSerializer):

    # For GET
    focus_body_parts = BodyPartSerializer(
        many=True,
        read_only=True
    )

    # For POST / PUT
    focus_body_part_ids = serializers.PrimaryKeyRelatedField(
        queryset=BodyPart.objects.all(),
        source="focus_body_parts",
        many=True,
        write_only=True,
        required=False
    )

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
            "focus_body_parts",      # read
            "focus_body_part_ids",   # write
            "workout_exercises",
        ]
    def create(self, validated_data):
        print(validated_data)
        focus_parts = validated_data.pop("focus_body_parts", [])
        workout = Workout.objects.create(**validated_data)
        workout.focus_body_parts.set(focus_parts)
        return workout