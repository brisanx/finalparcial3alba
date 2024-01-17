from django.urls import path
from parcial3beapp import views

urlpatterns = [
    # Objeto
    path('api/prueba/', views.prueba_view),
    path('api/prueba/busquedaLatLot/<str:direccion>/', views.find_by_lon_and_lat),
    path('api/prueba/<str:idp>/',views.prueba_detail_view),

    # Imagen
    path('api/image/upload', views.upload_image),
    
    # Login
    path('logged', views.oauth)
]