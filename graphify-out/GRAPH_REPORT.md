# Graph Report - Fitness-AI-Trainer-With-Automatic-Exercise-Recognition-and-Counting-main  (2026-06-28)

## Corpus Check
- 37 files · ~30,337 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 258 nodes · 326 edges · 28 communities (21 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6352f5a7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 20 edges
2. `compilerOptions` - 18 edges
3. `get_db()` - 15 edges
4. `Exercise` - 13 edges
5. `useAuth()` - 13 edges
6. `row_to_profile()` - 8 edges
7. `posture_detector` - 7 edges
8. `main()` - 7 edges
9. `voice_assistant_chat()` - 6 edges
10. `generate_workout_plan()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `voice_assistant_chat()` --calls--> `build_system_prompt()`  [INFERRED]
  backend/auth_api.py → backend/chatbot.py
- `voice_assistant_chat()` --calls--> `fetch_bmi_context()`  [INFERRED]
  backend/auth_api.py → backend/chatbot.py
- `main()` --calls--> `chat_ui()`  [INFERRED]
  backend/main.py → backend/chatbot.py
- `main()` --calls--> `inject_voice_assistant()`  [INFERRED]
  backend/main.py → backend/voice_assistant.py
- `CTAFooter()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/CTAFooter.tsx → frontend/src/context/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (28 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (18): CTAFooter(), Hero(), Navbar(), stats, AuthContext, AuthContextType, AuthProvider(), BmiHistoryPoint (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.14
Nodes (29): extract_json_block(), generate_diet_plan(), generate_workout_plan(), GenerateDietPlanRequest, GenerateWorkoutPlanRequest, get_bmi_history(), get_db(), get_diet_plan() (+21 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (25): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (9): calculate_angle(), calculate_distance(), calculate_y_distance(), count_repetition_bicep_curl(), count_repetition_push_up(), count_repetition_shoulder_press(), count_repetition_squat(), draw_styled_text() (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (15): 1. Frontend (`/frontend`), 2. Backend (`/backend`), Datasets and Resources, Getting Started, License and Contacts, Personal AI Trainer With Automatic Exercise Recognition and Counting, Prerequisites, Project Architecture (+7 more)

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (7): diet_to_list(), list_to_diet(), list_to_workout(), main(), workout_to_list(), inject_voice_assistant(), Voice Assistant v8.0 - Chat History + Response Box + Stop Speech

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (8): build_system_prompt(), chat_ui(), fetch_bmi_context(), initialize_session_state(), Message, on_click_callback(), Fetch BMI history and return a short trend summary for the system prompt., Build a personalized system prompt from the user's fitness profile.

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (9): dependencies, axios, framer-motion, lucide-react, react, react-dom, react-router-dom, recharts (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.40
Nodes (4): Features, FitAI Frontend, Getting Started, Tech Stack

## Knowledge Gaps
- **97 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `voice_assistant_chat()` connect `Community 1` to `Community 10`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `fetch_bmi_context()` connect `Community 10` to `Community 1`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `chat_ui()` connect `Community 10` to `Community 8`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `p1 and p2 in format (x1,y1) and (x2,y2) tuples`, `auth_api.py — FastAPI authentication server for Fitness AI Trainer. Handles user`, `Return a sqlite3 connection to the shared users.db file.` to the rest of the system?**
  _105 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.10037878787878787 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.14408602150537633 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._