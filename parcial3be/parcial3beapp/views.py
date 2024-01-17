from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
import pymongo
import cloudinary
import cloudinary.uploader

from datetime import datetime

from bson import ObjectId
from rest_framework.response import Response

from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import status
from geopy.geocoders import Nominatim

from pymongo import ReturnDocument

from google.oauth2 import id_token
from google.auth.transport import requests

from parcial3beapp.serializers import GastoSerializer, TokenSerializer

# -------- Geopy ---------
geolocator = Nominatim(user_agent="my_geocoder")

# ----------------------------------------  VISTAS DE LA APLICACIÓN ------------------------------
# Conexión a la base de datos MongoDB
my_client = pymongo.MongoClient(
    "mongodb+srv://dbUser:1234@albacluster.x5odmcy.mongodb.net/?retryWrites=true&w=majority"
)

# Nombre de la base de datos
dbname = my_client["FinalParcial3"]

# Colecciones
collection_gasto = dbname["gasto"]

# ---------------------------------------- CRUD ------------------------------------- #

@api_view(["GET", "POST"])
def prueba_view(request):
    if request.method == "GET":
        gasto = list(collection_gasto.find({}).sort("timestamp", -1))
        for g in gasto:
            g["_id"] = str(ObjectId(g.get("_id", [])))

        gasto_serializer = GastoSerializer(data=gasto, many=True)
        if gasto_serializer.is_valid():
            json_data = gasto_serializer.data
            return Response(json_data, status=status.HTTP_200_OK)
        else:
            return Response(
                gasto_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

    elif request.method == "POST":
            gasto = request.data
            gasto["_id"] = ObjectId()
            location = geolocator.geocode(gasto["lugar"])
            if location:
                gasto["lat"] = location.latitude
                gasto["lon"] = location.longitude

                result = collection_gasto.insert_one(gasto)
                if result.acknowledged:
                    return Response(
                        {"message": "Gasto creado con éxito."},
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {"error": "Algo salió mal. Gasto no creado."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            else:
                return Response({"error": "Dirección no válida"})
      

@api_view(["GET", "PUT", "DELETE"])
def prueba_detail_view(request, idp):
    if request.method == "PUT":
        serializer = GastoSerializer(data=request.data)
        if serializer.is_valid():
            prueba = serializer.validated_data
            prueba["_id"] = ObjectId(idp)

            location = geolocator.geocode(prueba["lugar"])
            if location:
                prueba["lat"] = location.latitude
                prueba["lon"] = location.longitude

                result = collection_gasto.replace_one({"_id": ObjectId(idp)}, prueba)
                if result.acknowledged:
                    return Response(
                        {
                            "message": "Gasto actualizado con éxito",
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"error": "Algo salió mal. Gasto no actualizado."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            else:
                return Response({"error": "Dirección no válida"})

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "GET":
        p = collection_gasto.find_one({"_id": ObjectId(idp)})
        p["_id"] = str(ObjectId(p.get("_id", [])))

        serializer = GastoSerializer(data=p)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        delete_data = collection_gasto.delete_one({"_id": ObjectId(idp)})
        if delete_data.deleted_count == 1:
            return Response(
                {"mensaje": "Gasto eliminado con éxito"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Gasto no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )


# ---------------------------------- BÚSQUEDAS PARAMETRIZADAS ----------------------------------------------------
@api_view(["GET"])
def find_by_lon_and_lat(request, direccion):
    if request.method == "GET":
        location = geolocator.geocode(direccion)
        if location:
            query = {
                "lat": {
                    "$gte": location.latitude - 0.2,
                    "$lte": location.latitude + 0.2,
                },
                "lon": {
                    "$gte": location.longitude - 0.2,
                    "$lte": location.longitude + 0.2,
                },
            }
            prueba = list(collection_gasto.find(query).sort("timestamp", pymongo.ASCENDING))
            for p in prueba:
                p["_id"] = str(ObjectId(p.get("_id", [])))

            prueba_serializer = GastoSerializer(data=prueba, many=True)
            if prueba_serializer.is_valid():
                json_data = prueba_serializer.data
                return Response(json_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    prueba_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response({"error": "Dirección no válida"})


# ---------------------------------- OAUTH ---------------------------------

CLIENT_ID = "644438743416-8qs1a5l687337gn7kfmthut9jrvtv1bs.apps.googleusercontent.com"

@api_view(["POST"])
def oauth(request):
    if request.method == "POST":
        serializer = TokenSerializer(data=request.data)
        if serializer.is_valid():
            tokenData = serializer.validated_data
            try:
                token = tokenData["idtoken"]
                # Specify the CLIENT_ID of the app that accesses the backend:
                idinfo = id_token.verify_oauth2_token(
                    token, requests.Request(), CLIENT_ID
                )

                # Or, if multiple clients access the backend server:
                # idinfo = id_token.verify_oauth2_token(token, requests.Request())
                # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
                #     raise ValueError('Could not verify audience.')

                # If auth request is from a G Suite domain:
                # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
                #     raise ValueError('Wrong hosted domain.')

                # ID token is valid. Get the user's Google Account ID from the decoded token.
                userid = idinfo["sub"]
                if userid:
                    return Response(
                        {
                            "userid": userid,
                        },
                        status=status.HTTP_200_OK,
                    )
            except ValueError:
                # Invalid token
                return Response(
                    {
                        "error": "Token no valido",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------- CLOUDINARY --------------------
@api_view(["POST"])
def upload_image(request):
    if request.method == "POST" and request.FILES.getlist("images"):
        uploaded_files = request.FILES.getlist("images")
        uploaded_urls = []

        # Upload each image to Cloudinary
        cloudinary.config(
             cloud_name="dkrlpnpyb",
             api_key="522138764113221",
             api_secret="DfmjcXO8cYmffAB2qacJ1qeefD8"
        )

        for file in uploaded_files:
            upload_result = cloudinary.uploader.upload(file, folder="ingenieriaweb")
            uploaded_urls.append(upload_result["secure_url"])
        return JsonResponse({"urls": uploaded_urls})
    return HttpResponse(status=400)
