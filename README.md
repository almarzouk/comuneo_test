# Todo-App mit Unteraufgaben

Eine Todo-Verwaltungs-App die ich für das Comuneo Take-Home Assignment entwickelt habe. Die Besonderheit ist die unbegrenzte Verschachtelung von Unteraufgaben - man kann also zu jeder Aufgabe weitere Unteraufgaben hinzufügen, und zu diesen wiederum weitere Unteraufgaben usw.

## Was kann die App?

Die Grundfunktionen sind relativ simpel:

- Registrierung und Login für Benutzer
- Aufgaben erstellen und löschen
- Aufgaben als erledigt markieren (mit Checkbox)
- Zu jeder Aufgabe Unteraufgaben hinzufügen - ohne Limit bei der Tiefe
- Unteraufgaben können ein- und ausgeklappt werden

Das Frontend validiert die Eingaben schon mal grob, aber die eigentliche Prüfung passiert dann nochmal auf dem Server. Ist vielleicht etwas redundant, aber besser als Müll in der Datenbank zu haben.

## Technologien

Ich hab mich für folgende Tools entschieden:

**Frontend & Backend Framework:**

- React Router v7 - ist noch relativ neu, macht aber den ganzen Server-side Rendering Kram ziemlich einfach
- TypeScript - weil ich keine Lust auf undefined-Fehler zur Laufzeit habe

**Backend:**

- Appwrite als BaaS - hätte auch ein eigenes Backend bauen können, aber für ein Take-Home Assignment erschien mir das übertrieben

**Styling:**

- Einfach nur CSS, keine Library - wollte zeigen dass man auch ohne Tailwind vernünftige UIs bauen kann

**Tests:**

- Vitest und React Testing Library - insgesamt 22 Tests die Component-Rendering und User-Interaktionen prüfen

## Installation und Setup

```bash
npm install
```

Dann brauchst du eine `.env` Datei im Root-Verzeichnis:
habe ich schen geschrieben

```env
APPWRITE_ENDPOINT=deine_appwrite_url
APPWRITE_PROJECT_ID=deine_projekt_id
APPWRITE_API_KEY=dein_api_key
APPWRITE_DATABASE_ID=deine_datenbank_id
APPWRITE_TODOS_COLLECTION_ID=deine_collection_id
```

## Entwicklung starten

```bash
npm run dev
```

Die App läuft dann auf Port 5173.

## Build für Production

```bash
npm run build
npm start
```

## Tests ausführen

```bash
npm test              # Alle Tests
npm run test:watch    # Watch Mode
npm run typecheck     # TypeScript Prüfung
```

## Projektstruktur

So hab ich das Ganze strukturiert:

```
app/
├── components/       # UI Components
│   ├── TodoHeader.tsx
│   ├── TodoList.tsx
│   ├── TodoItem.tsx      # Rendert sich rekursiv für Unteraufgaben
│   ├── AddTodoForm.tsx
│   └── *.test.tsx
│
├── routes/           # Die verschiedenen Seiten
│   ├── home.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   └── todos.tsx     # Hauptseite mit allen Todos
│
├── services/         # Business Logic
│   ├── auth/
│   │   ├── validation.ts
│   │   ├── helpers.server.ts
│   │   └── service.server.ts
│   └── todos/
│       ├── types.ts
│       ├── validation.ts
│       ├── helpers.server.ts
│       └── service.ts
│
├── lib/              # Appwrite Config & Utils
└── app.css          # Globales Styling
```

Die `TodoItem` Komponente ist wahrscheinlich am interessantesten - sie ruft sich selbst rekursiv auf um die Unteraufgaben zu rendern. Das war anfangs etwas tricky mit den TypeScript Types, läuft jetzt aber ganz gut.

## Wie funktioniert die Unteraufgaben-Logik?

In der Datenbank hat jede Todo ein optionales `parentId` Feld. Beim Laden der Todos bau ich dann eine Baumstruktur auf:

- Zuerst werden alle Todos ohne parentId geladen (das sind die Top-Level Todos)
- Dann ordne ich jedem Todo seine children zu
- Die TodoItem Component rendert sich dann selbst für jedes child

Der relevante Code ist in `app/services/todos/helpers.server.ts` - die `buildTodoTree` Funktion macht genau das.

## Validierung

Die Validierung passiert auf zwei Ebenen:

1. Client-seitig in den Formularen - gibt sofort Feedback wenn was nicht stimmt
2. Server-seitig vor dem Speichern - kann man nicht umgehen auch wenn jemand die Client-Validierung austrickst

Ist etwas doppelt gemoppelt, aber ich finds wichtig dass man sich auf die Server-Validierung verlassen kann.

## Deployment

Hab das Projekt so aufgesetzt dass es auf Vercel laufen sollte. Docker-Support ist auch dabei falls du es lieber selbst hosten willst.

Für Vercel:

```bash
vercel login
vercel
```

Dann noch die Environment Variables im Dashboard eintragen und fertig.

## Sonstiges

Die Tests decken die wichtigsten Komponenten ab - vor allem dass die Todos richtig gerendert werden, die Formulare funktionieren und die rekursive Darstellung klappt. Hab versucht mich auf die kritischen Flows zu konzentrieren statt 100% Coverage anzustreben.

Das Styling ist bewusst einfach gehalten - keine fancy Animationen oder so, einfach funktional und sauber.

---

Entwickelt für **Comuneo Take-Home Assignment**
