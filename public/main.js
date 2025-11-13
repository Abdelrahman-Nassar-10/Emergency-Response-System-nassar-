let currentLocation = null;
let view = null;
let graphicsLayer = null;

require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/geometry/Point",
], function (WebMap, MapView, Graphic, GraphicsLayer, Point) {
  graphicsLayer = new GraphicsLayer();

  const map = new WebMap({
    portalItem: { id: "55a428aade3544c3bbfc1598ec991a7e" },
  });
  map.when(() => {
    map.layers.forEach((layer) => {
      layer.visible = false;
      console.log("🔒 Hidden layer:", layer.title);
    });
  });

  view = new MapView({
    container: "map",
    map: map,
    center: [31.22, 30.05],
    zoom: 10,
  });

  map.add(graphicsLayer);

  view
    .when(() => console.log("✅ Map loaded successfully"))
    .catch((err) => console.error("❌ Error loading map:", err));

  // Click on map
  view.on("click", (event) => {
    const coords = [event.mapPoint.longitude, event.mapPoint.latitude];
    currentLocation = coords;
    addMarker(coords, [76, 175, 80]);
    Swal.fire(
      "✅ تم اختيار الموقع",
      `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`,
      "success"
    );
  });

  // Locate button
  document.getElementById("getLocationBtn").addEventListener("click", () => {
    if (!navigator.geolocation)
      return Swal.fire("خطأ", "متصفحك لا يدعم تحديد الموقع الجغرافي", "error");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        currentLocation = coords;
        addMarker(coords, [220, 53, 69]);
        Swal.fire(
          "✅ تم تحديد موقعك",
          `${pos.coords.longitude} , ${pos.coords.latitude}`,
          "success"
        );
      },
      (err) => {
        Swal.fire("خطأ", `تعذر تحديد الموقع: ${err.message}`, "error");
      }
    );
  });

  // Submit form
  const form = document.getElementById("reportForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentLocation)
      return Swal.fire("⚠️", "الرجاء اختيار موقع أولاً", "warning");

    const injuries = parseInt(document.getElementById("injuries").value);
    const desc = document.getElementById("desc").value;

    if (!injuries) return Swal.fire("⚠️", "أدخل عدد المصابين", "warning");

    const reportData = {
      geom: { type: "Point", coordinates: currentLocation },
      numberOfAccidents: injuries,
      description: desc,
      userId: 1,
      timestamp: new Date().toISOString(),
    };

    socket.emit("newAccident", reportData);
    Swal.fire("✅ تم إرسال البلاغ", "شكراً لك!", "success");
  });

  function addMarker(coords, color) {
    const point = new Point({ longitude: coords[0], latitude: coords[1] });
    const marker = new Graphic({
      geometry: point,
      symbol: {
        type: "simple-marker",
        color,
        size: 16,
        outline: { color: "white", width: 2 },
      },
    });
    graphicsLayer.removeAll();
    graphicsLayer.add(marker);
    view.goTo({ center: coords, zoom: 15 });
  }
});
