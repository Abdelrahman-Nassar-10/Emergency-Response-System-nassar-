let socket;
let accidents = [];

// ===== DATA STATIC =====
const hospitalGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.2243, 30.0626] },
      properties: { name_ar: "مستشفى السلام", beds: 8 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.2365, 30.0444] },
      properties: { name_ar: "مستشفى النيل", beds: 12 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.2181, 30.0511] },
      properties: { name_ar: "مستشفى الرحمة", beds: 15 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.2402, 30.0567] },
      properties: { name_ar: "مستشفى الشفاء", beds: 10 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.2105, 30.0602] },
      properties: { name_ar: "مستشفى الأمل", beds: 6 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.2301, 30.0489] },
      properties: { name_ar: "مستشفى دار السلام", beds: 11 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.2222, 30.0555] },
      properties: { name_ar: "مستشفى التحرير", beds: 9 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.2501, 30.0588] },
      properties: { name_ar: "مستشفى القاهرة الجديدة", beds: 14 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.215, 30.065] },
      properties: { name_ar: "مستشفى فيصل", beds: 7 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.245, 30.04] },
      properties: { name_ar: "مستشفى أكتوبر", beds: 13 },
    },
  ],
};

const ambulanceGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.221, 30.06] },
      properties: { name_ar: "اسعاف الزمالك" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.21, 30.05] },
      properties: { name_ar: "اسعاف المهندسين" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.23, 30.055] },
      properties: { name_ar: "اسعاف وسط البلد" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.25, 30.062] },
      properties: { name_ar: "اسعاف مصر الجديدة" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.28, 30.01] },
      properties: { name_ar: "اسعاف المعادي" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.26, 30.07] },
      properties: { name_ar: "اسعاف مدينة نصر" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.32, 30.07] },
      properties: { name_ar: "اسعاف التجمع الخامس" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.4, 30.15] },
      properties: { name_ar: "اسعاف العبور" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.3, 30.08] },
      properties: { name_ar: "اسعاف الرحاب" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.2, 30.02] },
      properties: { name_ar: "اسعاف أكتوبر" },
    },
  ],
};

// ===== Notification Sound =====
function playNotification() {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log("⚠️ Could not play notification sound:", error);
  }
}

// ===== CONNECT TO SOCKET.IO =====
try {
  socket = io("http://localhost:2511", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });
  socket.on("connect", () => {
    console.log("✅ Dashboard connected - Socket ID:", socket.id);
    socket.emit("getAllAccidents");
  });
  socket.on("disconnect", () => console.log("❌ Dashboard disconnected"));
  socket.on("connect_error", (error) =>
    console.log("⚠️ Socket connection error:", error.message)
  );
  socket.on("allAccidents", (list) => {
    accidents = list.map((accident) => ({
      ...accident,
      id: accident.id || Date.now() + Math.random().toString(36).substr(2, 5),
    }));
    renderAccidents();
  });
  socket.on("newAccident", (accident) => {
    if (!accident.id)
      accident.id = Date.now() + Math.random().toString(36).substr(2, 5);

    const exists = accidents.some(
      (a) =>
        a.geom.coordinates[0] === accident.geom.coordinates[0] &&
        a.geom.coordinates[1] === accident.geom.coordinates[1] &&
        Math.abs(new Date(a.timestamp) - new Date(accident.timestamp)) < 5000
    );

    if (!exists) {
      accidents.unshift(accident);
      renderAccidents();
      playNotification();

      // ✅ تحديث عداد البلاغات
      const totalEl = document.getElementById("totalReports");
      if (totalEl) {
        const currentCount = parseInt(totalEl.textContent) || 0;
        totalEl.textContent = currentCount + 1;
      }
    }
  });
} catch (error) {
  console.log("❌ Socket.io not available:", error.message);
}

// ===== DELETE ACCIDENT =====
function deleteAccident(index) {
  Swal.fire({
    title: "هل أنت متأكد؟",
    text: "سيتم حذف هذا البلاغ نهائياً",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "نعم، احذف",
    cancelButtonText: "إلغاء",
  }).then((result) => {
    if (result.isConfirmed) {
      accidents.splice(index, 1);
      renderAccidents();
      if (window.currentView) window.currentView.graphics.removeAll();
    }
  });
}

// ===== RENDER ACCIDENTS LIST =====
function renderAccidents() {
  const container = document.getElementById("accidentsList");
  if (!accidents || accidents.length === 0) {
    container.innerHTML = `
      <div class="no-accidents">
        <div class="no-accidents-icon">📭</div>
        <p>لا توجد بلاغات جديدة</p>
      </div>`;
    return;
  }
  container.innerHTML = accidents
    .map((accident, index) => {
      const time = new Date(accident.timestamp).toLocaleString("ar-EG");
      return `
        <div class="accident-card">
          <div class="accident-header">
            <span class="accident-id">بلاغ #${accident.id || index + 1}</span>
            <span class="accident-time">${time}</span>
          </div>
          <div class="accident-info">
            <div class="info-row">
              <span class="info-label">عدد المصابين:</span>
              <span class="injuries-badge">${accident.numberOfAccidents}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📍 الموقع:</span>
              <span class="info-value">${accident.geom.coordinates[1].toFixed(
                4
              )}, ${accident.geom.coordinates[0].toFixed(4)}</span>
            </div>
          </div>
          <div class="accident-actions">
            <button class="view-btn" id="viewBtn${index}" onclick="showAccidentOnMap(${index})">
              🗺️ عرض على الخريطة
            </button>
            <button class="delete-btn" onclick="deleteAccident(${index})">
              🗑️ حذف البلاغ
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

// ===== INITIALIZE MAP & SHOW ACCIDENT =====
require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/geometry/Point",
  "esri/layers/GraphicsLayer",
  "esri/rest/closestFacility",
  "esri/rest/support/ClosestFacilityParameters",
  "esri/rest/support/FeatureSet",
], function (
  WebMap,
  MapView,
  Graphic,
  Point,
  GraphicsLayer,
  closestFacility,
  ClosestFacilityParameters,
  FeatureSet
) {
  const map = new WebMap({
    portalItem: { id: "55a428aade3544c3bbfc1598ec991a7e" },
  });

  map.when(() => {
    map.layers.forEach((layer) => {
      layer.visible = false;
      console.log("🔒 Hidden layer:", layer.title);
    });
  });

  const view = new MapView({
    container: "map",
    map,
    center: [31.22, 30.05],
    zoom: 10,
  });
  window.currentView = view;

  const hospitalsLayer = new GraphicsLayer({ title: "المستشفيات" });
  const ambulancesLayer = new GraphicsLayer({ title: "محطات الإسعاف" });
  const routesLayer = new GraphicsLayer({ title: "المسارات" });
  map.addMany([hospitalsLayer, ambulancesLayer, routesLayer]);

  // عرض المستشفيات مع رمز مستشفى حقيقي
  hospitalGeoJSON.features.forEach((feature) => {
    const graphic = new Graphic({
      geometry: new Point({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
      }),
      symbol: {
        type: "picture-marker",
        url: "data:image/svg+xml,%3Csvg xmlns='https://www.svgrepo.com/svg/530550/ambulance' viewBox='0 0 24 24' fill='%232196F3'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 18h-4v-6h4v6zm5-8h-4v4h-4v-4H5V5h14v8z'/%3E%3C/svg%3E",
        width: "32px",
        height: "32px",
      },
      attributes: feature.properties,
      popupTemplate: {
        title: "{name_ar}",
        content: "🏥 مستشفى | الأسرة المتاحة: {beds}",
      },
    });
    hospitalsLayer.add(graphic);
  });

  // عرض محطات الإسعاف مع رمز إسعاف حقيقي
  ambulanceGeoJSON.features.forEach((feature) => {
    const graphic = new Graphic({
      geometry: new Point({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
      }),
      symbol: {
        type: "picture-marker",
        url: "data:image/svg+xml,%3Csvg xmlns='https://www.svgrepo.com/svg/475527/hospital' viewBox='0 0 24 24' fill='%23FF9800'%3E%3Cpath d='M18 12h-1V4c0-.5-.5-1-1-1H8c-.5 0-1 .5-1 1v8H6c-2.76 0-5 2.24-5 5s2.24 5 5 5h12c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-9-7h6v7h-6V5zm9 12H6c-1.65 0-3-1.35-3-3s1.35-3 3-3h12c1.65 0 3 1.35 3 3s-1.35 3-3 3z'/%3E%3C/svg%3E",
        width: "32px",
        height: "32px",
      },
      attributes: feature.properties,
      popupTemplate: {
        title: "{name_ar}",
        content: "🚑 محطة إسعاف",
      },
    });
    ambulancesLayer.add(graphic);
  });

  const closestFacilityUrl =
    "https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World";

  window.showAccidentOnMap = async function (index) {
    const btn = document.getElementById(`viewBtn${index}`);
    if (btn) {
      btn.disabled = true;
      btn.textContent = "جاري الحساب...";
    }

    const accident = accidents[index];
    if (!accident || !accident.geom) {
      Swal.fire("خطأ", "بيانات الحادث غير صحيحة", "error");
      if (btn) {
        btn.disabled = false;
        btn.textContent = "🗺️ عرض على الخريطة";
      }
      return;
    }

    const coords = accident.geom.coordinates;
    routesLayer.removeAll();

    const incidentPoint = new Point({
      longitude: coords[0],
      latitude: coords[1],
    });

    // إضافة علامة الحادث
    const accidentMarker = new Graphic({
      geometry: incidentPoint,
      symbol: {
        type: "simple-marker",
        color: [255, 68, 68],
        size: 20,
        outline: { color: [255, 255, 255], width: 3 },
      },
      popupTemplate: {
        title: "🚨 موقع الحادث",
        content: `عدد المصابين: ${accident.numberOfAccidents}`,
      },
    });
    routesLayer.add(accidentMarker);

    try {
      // ===== STEP 1: إيجاد أقرب إسعاف =====
      const ambulanceGraphics = ambulanceGeoJSON.features.map(
        (f, idx) =>
          new Graphic({
            geometry: new Point({
              longitude: f.geometry.coordinates[0],
              latitude: f.geometry.coordinates[1],
            }),
            attributes: {
              FacilityID: idx,
              ...f.properties,
            },
          })
      );

      const cfParams1 = new ClosestFacilityParameters({
        incidents: new FeatureSet({
          features: [accidentMarker],
        }),
        facilities: new FeatureSet({
          features: ambulanceGraphics,
        }),
        returnRoutes: true,
        returnDirections: false,
        defaultTargetFacilityCount: 1,
      });

      console.log("🔍 Calculating route to ambulance...");
      const result1 = await closestFacility.solve(
        closestFacilityUrl,
        cfParams1
      );

      if (!result1.routes || result1.routes.features.length === 0) {
        throw new Error("لم يتم العثور على مسار للإسعاف");
      }

      const routeToAmbulance = result1.routes.features[0];
      const ambulanceIndex = routeToAmbulance.attributes.FacilityID;
      const closestAmbulance = ambulanceGeoJSON.features[ambulanceIndex];

      // رسم المسار للإسعاف
      routeToAmbulance.symbol = {
        type: "simple-line",
        color: [255, 152, 0],
        width: 5,
      };
      routesLayer.add(routeToAmbulance);

      const ambulancePoint = new Point({
        longitude: closestAmbulance.geometry.coordinates[0],
        latitude: closestAmbulance.geometry.coordinates[1],
      });

      // تمييز الإسعاف الأقرب
      const selectedAmbulance = new Graphic({
        geometry: ambulancePoint,
        symbol: {
          type: "simple-marker",
          color: [76, 175, 80],
          size: 18,
          outline: { color: [255, 255, 255], width: 3 },
        },
      });
      routesLayer.add(selectedAmbulance);

      // ===== STEP 2: إيجاد أقرب مستشفى بها أسرة كافية =====
      const availableHospitals = hospitalGeoJSON.features.filter(
        (h) => h.properties.beds > accident.numberOfAccidents
      );

      if (availableHospitals.length === 0) {
        throw new Error(
          "لا توجد مستشفيات بها أسرة كافية للمصابين في الوقت الحالي"
        );
      }

      const hospitalGraphics = availableHospitals.map(
        (f, idx) =>
          new Graphic({
            geometry: new Point({
              longitude: f.geometry.coordinates[0],
              latitude: f.geometry.coordinates[1],
            }),
            attributes: {
              FacilityID: hospitalGeoJSON.features.indexOf(f),
              ...f.properties,
            },
          })
      );

      const cfParams2 = new ClosestFacilityParameters({
        incidents: new FeatureSet({
          features: [accidentMarker],
        }),
        facilities: new FeatureSet({
          features: hospitalGraphics,
        }),
        returnRoutes: true,
        returnDirections: false,
        defaultTargetFacilityCount: 1,
      });

      console.log("🔍 Calculating route to hospital...");
      const result2 = await closestFacility.solve(
        closestFacilityUrl,
        cfParams2
      );

      if (!result2.routes || result2.routes.features.length === 0) {
        throw new Error("لم يتم العثور على مسار للمستشفى");
      }

      const routeToHospital = result2.routes.features[0];
      const hospitalIndex = routeToHospital.attributes.FacilityID;
      const closestHospital = hospitalGeoJSON.features[hospitalIndex];

      // رسم المسار للمستشفى
      routeToHospital.symbol = {
        type: "simple-line",
        color: [33, 150, 243],
        width: 5,
      };
      routesLayer.add(routeToHospital);

      const hospitalPoint = new Point({
        longitude: closestHospital.geometry.coordinates[0],
        latitude: closestHospital.geometry.coordinates[1],
      });

      // تمييز المستشفى الأقرب
      const selectedHospital = new Graphic({
        geometry: hospitalPoint,
        symbol: {
          type: "simple-marker",
          color: [33, 150, 243],
          size: 18,
          outline: { color: [255, 255, 255], width: 3 },
        },
      });
      routesLayer.add(selectedHospital);

      // التحرك لعرض كل العناصر
      view.goTo(
        {
          target: [
            accidentMarker,
            selectedAmbulance,
            selectedHospital,
            routeToAmbulance,
            routeToHospital,
          ],
          zoom: 12,
        },
        { duration: 1500 }
      );

      // عرض النتائج
      const distance1 = (
        routeToAmbulance.attributes.Total_Kilometers || 0
      ).toFixed(2);
      const time1Calculated = ((parseFloat(distance1) / 70) * 60).toFixed(1);
      const distance2 = (
        routeToHospital.attributes.Total_Kilometers || 0
      ).toFixed(2);
      const time2Calculated = ((parseFloat(distance2) / 70) * 60).toFixed(1);

      Swal.fire({
        title: "✅ تم حساب المسار بنجاح",
        html: `
    <div style="text-align: center; direction: ltr; padding: 15px;">
      <h4 style="color: #FF9800; margin-bottom: 10px;">🚑 المسار للإسعاف</h4>
      <p><strong>${closestAmbulance.properties.name_ar}</strong></p>
      <p>المسافة: <strong>${distance1} كم</strong> | الوقت: <strong>${time1Calculated} دقيقة</strong></p>
      <hr style="margin: 15px 0;">
      <h4 style="color: #2196F3; margin-bottom: 10px;">🏥 المسار للمستشفى</h4>
      <p><strong>${closestHospital.properties.name_ar}</strong></p>
      <p>المسافة: <strong>${distance2} كم</strong> | الوقت: <strong>${time2Calculated} دقيقة</strong></p>
      <p style="font-size: 14px; color: #666;">الأسرة المتاحة: <strong>${
        closestHospital.properties.beds
      }</strong></p>
      <hr style="margin: 15px 0;">
      <p style="font-size: 16px;"><strong>📍 إجمالي المسافة:</strong> ${(
        parseFloat(distance1) + parseFloat(distance2)
      ).toFixed(2)} كم</p>
      <p style="font-size: 16px;"><strong>⏱️ إجمالي الوقت:</strong> ${(
        parseFloat(time1Calculated) + parseFloat(time2Calculated)
      ).toFixed(1)} دقيقة</p>
    </div>
  `,

        icon: "success",
        confirmButtonText: "حسناً",
      });
    } catch (error) {
      console.error("❌ Error:", error);
      Swal.fire({
        title: "خطأ",
        text: error.message || "حدث خطأ أثناء حساب المسار",
        icon: "error",
      });
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "🗺️ عرض على الخريطة";
      }
    }
  };
});
