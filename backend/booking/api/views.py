# slots/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import SlotSerializer,Slot
import datetime

class CreateSlotsView(APIView):
    def post(self, request, *args, **kwargs):
        date = request.data.get('date')
        start_time = request.data.get('startTime')
        end_time = request.data.get('endTime')
        break_time = request.data.get('breakTime')

        start = datetime.datetime.strptime(f"{date} {start_time}", "%Y-%m-%d %H:%M")
        end = datetime.datetime.strptime(f"{date} {end_time}", "%Y-%m-%d %H:%M")
        break_duration = datetime.timedelta(hours=break_time)

        slot_duration = datetime.timedelta(minutes=5)
        slots = []

        while start < end:
            slot_end = start + slot_duration
            slot = Slot(start_time=start, end_time=slot_end)
            slot.save()
            slots.append(SlotSerializer(slot).data)
            start = slot_end + break_duration

        return Response({"message": "Slots created successfully", "slots": slots}, status=status.HTTP_201_CREATED)
