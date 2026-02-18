from django import forms
from .models import WorkoutExercise, SetEntry
from django.forms import inlineformset_factory



class WorkoutExcerciseForm(forms.ModelForm):
    class Meta:
        model = WorkoutExercise
        fields = ["exercise", "notes"]  # removed order_index

class SetEntryForm(forms.ModelForm):
    class Meta:
        model = SetEntry
        fields = ["weight","reps"]

SetEntryFormSet = inlineformset_factory(
    parent_model=WorkoutExercise,
    model=SetEntry,
    form=SetEntryForm,
    fields=["weight","reps"],
    extra=3,
    can_order=True
)








