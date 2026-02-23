# from django.urls import path
# from . import views

# urlpatterns = [
#     path("workout/create/",view=views.create_workout,name="create_workout"),
#     path("workout/<int:pk>",view=views.workout_detail,name="workout_detail"),
#     path("workout_exercise/<int:pk>/delete",view=views.delete_workout,name="delete_workout"),
#     path("workout_exercise/<int:pk>/add-set",view=views.add_set_entry,name="add_set"),
#     path("set/<int:pk>/delete",view=views.delete_set_entry,name="delete_set"),
#     path("workout/<int:pk>/summery",view=views.workout_summery,name="workout_summery"),
#     path("workout/list",view=views.workout_list,name='workout_list'),
#     path("workout_exercise/<int:pk>/sets",view=views.manage_sets,name='manage_sets')
# ]

from rest_framework.routers import DefaultRouter
from .views import (
    WorkoutViewSet,
    WorkoutExerciseViewSet,
    SetEntryViewSet,
    BodyPartViewSet,
    ExcerciseViewSet
)

router = DefaultRouter()
router.register(r"workouts", WorkoutViewSet)
router.register(r"workout-exercises", WorkoutExerciseViewSet)
router.register(r"sets", SetEntryViewSet)
router.register(r"body-parts", BodyPartViewSet)
router.register(r"exercises",ExcerciseViewSet)

urlpatterns = router.urls

