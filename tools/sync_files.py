#!/usr/bin/env python3
"""
Synchronizes root-level assets and implementations to src/ mirrors.
Ensures parity between index.html root imports and modular src/ structure.
"""

def sync():
    # Sync CSS
    with open('style.css', 'r', encoding='utf-8') as f:
        css = f.read()
    with open('src/styles/main.css', 'w', encoding='utf-8') as f:
        f.write(css)

    # Sync desktop.js with import path adjustments
    with open('js/desktop.js', 'r', encoding='utf-8') as f:
        js = f.read()

    js_src = js.replace("import { sound } from './audio.js';", "import { sound } from '../core/audio.js';")
    js_src = js_src.replace("import { TerminalEngine } from './terminal.js';", "import { TerminalEngine } from '../apps/terminal.js';")
    js_src = js_src.replace("import { WindSimulator } from './simWind.js';", "import { WindSimulator } from '../apps/simWind.js';")
    js_src = js_src.replace("import { RobotSimulator } from './simRobot.js';", "import { RobotSimulator } from '../apps/simRobot.js';")
    js_src = js_src.replace("import { AgentSimulator } from './simAgent.js';", "import { AgentSimulator } from '../apps/simAgent.js';")
    js_src = js_src.replace("} from './portfolioData.js';", "} from '../core/portfolioData.js';")

    with open('src/os/desktop.js', 'w', encoding='utf-8') as f:
        f.write(js_src)

    # Sync portfolioData.js
    with open('js/portfolioData.js', 'r', encoding='utf-8') as f:
        data_js = f.read()
    with open('src/core/portfolioData.js', 'w', encoding='utf-8') as f:
        f.write(data_js)

    # Sync terminal.js with import path adjustments
    with open('js/terminal.js', 'r', encoding='utf-8') as f:
        term_js = f.read()
    term_src = term_js.replace("import { sound } from './audio.js';", "import { sound } from '../core/audio.js';")
    term_src = term_src.replace("} from './portfolioData.js';", "} from '../core/portfolioData.js';")
    with open('src/apps/terminal.js', 'w', encoding='utf-8') as f:
        f.write(term_src)

    print('[SYNC] Successfully synchronized style.css, js/desktop.js, js/portfolioData.js, and js/terminal.js to src/')

if __name__ == '__main__':
    sync()
