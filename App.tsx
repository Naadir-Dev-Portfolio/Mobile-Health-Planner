import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  RefreshControl,
  Platform,
  StatusBar,
  PanResponder,
  Linking
} from "react-native";
import { WebView } from "react-native-webview";
import { Asset } from "expo-asset";

import { WORKOUT_ASSETS, type WorkoutAsset } from "./workouts.generated";
import { REGIMEN_HTML } from "./regimen.bundle";

type Screen = "home" | "workouts" | "regimen";

type Workout = {
  file: string;
  title: string;
  uri: string;
};

const BG = "#121212";
const PANEL = "#1b1b1b";
const CARD = "#1f1f1f";
const BORDER = "#2a2a2a";
const TEXT = "#f2f2f2";
const MUTED = "#a9a9a9";

function stripExt(file: string) {
  return file.replace(/\.html$/i, "");
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function buildInjectedJs(zoom: number) {
  return `
(function() {
  try {
    const Z = ${zoom.toFixed(4)};
    const BG = "${BG}";
    const TEXT = "${TEXT}";
    if (!document.querySelector('meta[name="viewport"]')) {
      const m = document.createElement('meta');
      m.name = 'viewport';
      m.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      document.head && document.head.appendChild(m);
    }

    let root = document.getElementById('__wp_root__');
    if (!root) {
      root = document.createElement('div');
      root.id = '__wp_root__';
      while (document.body && document.body.firstChild) {
        root.appendChild(document.body.firstChild);
      }
      document.body && document.body.appendChild(root);
      document.body && (document.body.style.margin = '0');
      document.body && (document.body.style.padding = '0');
    }

    let st = document.getElementById('__wp_dark__');
    if (!st) {
      st = document.createElement('style');
      st.id = '__wp_dark__';
      st.type = 'text/css';
      st.appendChild(document.createTextNode(
        [
          ":root { color-scheme: dark; }",
          "html, body { background: " + BG + " !important; color: " + TEXT + " !important; }",
          "a { color: #8ab4f8 !important; }",
          "::-webkit-scrollbar{ width:10px; height:10px; background:transparent; }",
          "::-webkit-scrollbar-track{ background: rgba(0,0,0,0.35); border-radius:5px; }",
          "::-webkit-scrollbar-thumb{ background:#555; border-radius:5px; }",
          "::-webkit-scrollbar-thumb:hover{ background:#777; }",
          "::-webkit-scrollbar-corner{ background: rgba(0,0,0,0.35); }",
          "#__wp_root__{ transform-origin: top left; }"
        ].join("\\n")
      ));
      (document.head || document.documentElement).appendChild(st);
    }

    if (root) {
      root.style.transform = 'scale(' + Z + ')';
      document.body && (document.body.style.width = (100 / Z) + '%');
    }

    document.documentElement.style.background = BG;
    document.body && (document.body.style.background = BG);
  } catch(e) {}
})();
true;
`;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [active, setActive] = useState<Workout | null>(null);
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [regimenStatus, setRegimenStatus] = useState<"loading" | "ready" | "error">("loading");
  const [regimenError, setRegimenError] = useState("");

  const [zoom, setZoom] = useState(1.0);
  const webRef = useRef<WebView>(null);

  const applyDeepLink = (url: string | null) => {
    if (!url) return;

    const noScheme = url.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, "");
    const route = noScheme.replace(/^\/+/, "").split(/[/?#]/)[0]?.toLowerCase();

    if (route === "workouts") {
      setActive(null);
      setScreen("workouts");
      return;
    }

    if (route === "regimen") {
      setScreen("regimen");
      return;
    }

    if (!route || route === "home") {
      setActive(null);
      setScreen("home");
    }
  };

  async function loadWorkouts() {
    const assets = WORKOUT_ASSETS.map((w: WorkoutAsset) => Asset.fromModule(w.mod));

    await Promise.all(
      assets.map(async (a) => {
        try {
          await a.downloadAsync();
        } catch {}
      })
    );

    const list: Workout[] = WORKOUT_ASSETS
      .map((w, i) => ({
        file: w.file,
        title: w.title,
        uri: assets[i]?.localUri || assets[i]?.uri || ""
      }))
      .filter((w) => !!w.uri);

    setWorkouts(list);

    setActive((prev) => {
      if (!list.length) return null;
      if (!prev) return null;
      const still = list.find((x) => x.file === prev.file);
      return still || list[0];
    });
  }

  async function loadRegimen() {
    setRegimenStatus("loading");
    setRegimenError("");

    try {
      if (!REGIMEN_HTML || !REGIMEN_HTML.trim()) {
        throw new Error("Generated regimen bundle is empty.");
      }
      setRegimenStatus("ready");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setRegimenError(msg);
      setRegimenStatus("error");
    }
  }

  useEffect(() => {
    void Promise.all([loadWorkouts(), loadRegimen()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void Linking.getInitialURL().then((url) => {
      applyDeepLink(url);
    });

    const sub = Linking.addEventListener("url", ({ url }) => {
      applyDeepLink(url);
    });

    return () => {
      sub.remove();
    };
  }, []);

  const filtered = useMemo(() => {
    const t = query.trim().toUpperCase();
    if (!t) return workouts;
    return workouts.filter((w) => w.title.includes(t));
  }, [query, workouts]);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await loadWorkouts();
      await loadRegimen();
    } finally {
      setRefreshing(false);
    }
  }

  const panResponder = useMemo(() => {
    let startZoom = zoom;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 6,
      onPanResponderGrant: () => {
        startZoom = zoom;
      },
      onPanResponderMove: (_, g) => {
        const dz = (g.dx / 200) * 0.15;
        const next = clamp(startZoom + dz, 0.7, 1.3);
        setZoom(next);
      },
      onPanResponderRelease: () => {},
      onPanResponderTerminationRequest: () => true
    });
  }, [zoom]);

  useEffect(() => {
    if (!active) return;
    webRef.current?.injectJavaScript(buildInjectedJs(zoom));
  }, [zoom, active]);

  const topPad = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

  if (screen === "workouts" && active) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: topPad }]}> 
        <View style={styles.viewerHeader}>
          <TouchableOpacity onPress={() => setActive(null)} style={styles.backBtn}>
            <Image source={require("./assets/arrow-95-64-left.png")} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.viewerTitle} numberOfLines={1}>
            {active.title}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <WebView
          ref={webRef}
          source={{ uri: active.uri }}
          style={styles.web}
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled
          injectedJavaScript={buildInjectedJs(zoom)}
          setSupportMultipleWindows={false}
          allowFileAccess
          allowingReadAccessToURL={active.uri}
        />

        <View style={styles.viewerFooter} {...panResponder.panHandlers}>
          <Text style={styles.footerText} numberOfLines={1}>
            {stripExt(active.file)}
          </Text>
          <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "regimen") {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: topPad }]}> 
        <View style={styles.viewerHeader}>
          <TouchableOpacity onPress={() => setScreen("home")} style={styles.backBtn}>
            <Image source={require("./assets/arrow-95-64-left.png")} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.viewerTitle} numberOfLines={1}>
            SUPPLEMENT PLAN
          </Text>
          <View style={{ width: 44 }} />
        </View>

        {regimenStatus === "ready" ? (
          <WebView
            source={{ html: REGIMEN_HTML }}
            style={styles.web}
            originWhitelist={["*"]}
            javaScriptEnabled
            domStorageEnabled
            setSupportMultipleWindows={false}
            allowFileAccess
            allowFileAccessFromFileURLs
            allowUniversalAccessFromFileURLs
          />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>REGIMEN NOT READY</Text>
            <Text style={styles.emptyText}>
              {regimenStatus === "error" ? regimenError || "Regimen failed to load." : "Still loading regimen..."}
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  if (screen === "home") {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: topPad }]}> 
        <View style={styles.homeWrap}>
          <Image source={require("./assets/logo.png")} style={styles.homeLogo} />
          <Text style={styles.appTitle}>MOBILE HEALTH PLANNER</Text>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => {
              setActive(null);
              setScreen("workouts");
            }}
          >
            <Text style={styles.homeBtnTitle}>Workout Planner</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeBtn} onPress={() => setScreen("regimen")}>
            <Text style={styles.homeBtnTitle}>Supplement Planner</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPad }]}> 
      <View style={styles.viewerHeader}>
        <TouchableOpacity onPress={() => setScreen("home")} style={styles.backBtn}>
          <Image source={require("./assets/arrow-95-64-left.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.viewerTitle} numberOfLines={1}>
          WORKOUT PLAN
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.top}>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
        <Text style={styles.appTitle}>WORKOUT PLAN</Text>
        <Text style={styles.subTitle}>{workouts.length ? `${workouts.length} WORKOUTS` : "NO WORKOUTS LOADED"}</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="FILTER WORKOUTS..."
          placeholderTextColor={MUTED}
          style={styles.search}
          autoCapitalize="characters"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.file}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={TEXT} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setActive(item)}>
            <Text style={styles.cardText} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardMeta} numberOfLines={1}>
              {stripExt(item.file)}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>NO WORKOUTS MATCH</Text>
            <Text style={styles.emptyText}>Try a different filter.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  homeWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 16, paddingBottom: 42 },
  homeLogo: { width: 184, height: 184, marginBottom: 14, borderRadius: 40 },
  homeBtn: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 34,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginTop: 12
  },
  homeBtnTitle: { color: TEXT, fontSize: 20, fontWeight: "700", letterSpacing: 0.2, textAlign: "center" },

  top: { alignItems: "center", paddingTop: 18, paddingBottom: 10 },
  logo: { width: 78, height: 78, marginBottom: 10, borderRadius: 18 },
  appTitle: { color: TEXT, fontSize: 22, fontWeight: "900", letterSpacing: 1, marginBottom: 52 },
  subTitle: { color: MUTED, fontSize: 12, fontWeight: "800", marginTop: 4 },

  searchWrap: { paddingHorizontal: 16, paddingBottom: 10 },
  search: {
    backgroundColor: PANEL,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 12, android: 10, default: 10 }),
    color: TEXT,
    fontWeight: "800"
  },

  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12
  },
  cardText: { color: TEXT, fontSize: 18, fontWeight: "900" },
  cardMeta: { color: MUTED, fontSize: 12, fontWeight: "700", marginTop: 6 },

  empty: {
    marginTop: 30,
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 16,
    backgroundColor: PANEL,
    borderColor: BORDER,
    borderWidth: 1
  },
  emptyTitle: { color: TEXT, fontSize: 16, fontWeight: "900" },
  emptyText: { color: MUTED, marginTop: 6, fontSize: 13, fontWeight: "700" },

  viewerHeader: {
    height: 56,
    borderBottomWidth: 1,
    borderColor: BORDER,
    backgroundColor: PANEL,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10
  },
  backBtn: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  backIcon: { width: 20, height: 20, tintColor: TEXT, resizeMode: "contain" },
  viewerTitle: { flex: 1, color: TEXT, fontSize: 16, fontWeight: "900", paddingHorizontal: 6 },

  web: { flex: 1, backgroundColor: BG },

  viewerFooter: {
    height: 38,
    borderTopWidth: 1,
    borderColor: BORDER,
    backgroundColor: PANEL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12
  },
  footerText: { color: MUTED, fontSize: 12, fontWeight: "800", flex: 1 },
  zoomText: { color: MUTED, fontSize: 12, fontWeight: "900", marginLeft: 10 }
});
