from rest_framework import serializers

class GastoSerializer(serializers.Serializer):

    _id = serializers.CharField(max_length = 24, required=False)
    timestamp = serializers.DateTimeField(required=False)
    concepto = serializers.CharField(required=False)
    importe = serializers.FloatField(required = False)
    email = serializers.CharField(required=False)
    lugar = serializers.CharField(required = False)
    lat = serializers.FloatField(required = False)
    lon = serializers.FloatField(required = False)
    token = serializers.CharField(required = False)
    imagen = serializers.CharField(required = False)
    
class TokenSerializer(serializers.Serializer):
    idtoken = serializers.CharField()
