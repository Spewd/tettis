/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles.css */ \"./styles.css\");\n/* harmony import */ var cubing_twisty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cubing/twisty */ \"./node_modules/cubing/dist/lib/cubing/twisty/index.js\");\n/* harmony import */ var gan_web_bluetooth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gan-web-bluetooth */ \"./node_modules/gan-web-bluetooth/dist/esm/index.mjs\");\n/* harmony import */ var cubing_kpuzzle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cubing/kpuzzle */ \"./node_modules/cubing/dist/lib/cubing/kpuzzle/index.js\");\n/* harmony import */ var cubing_puzzles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! cubing/puzzles */ \"./node_modules/cubing/dist/lib/cubing/puzzles/index.js\");\n/* harmony import */ var cubing_bluetooth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! cubing/bluetooth */ \"./node_modules/cubing/dist/lib/cubing/bluetooth/index.js\");\n/* harmony import */ var cubing_scramble__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! cubing/scramble */ \"./node_modules/cubing/dist/lib/cubing/scramble/index.js\");\n/* harmony import */ var cubing_alg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! cubing/alg */ \"./node_modules/cubing/dist/lib/cubing/alg/index.js\");\n\n\n\n\n\n\n\n\nconst state = {\n  twistyPlayer: null,\n  kpuzzle: null,\n  kpattern: null,\n  ktransformation: null,\n  connection: null,\n  scrambleMoves: [],\n  currentScrambleIndex: 0,\n  correctionMode: false,\n  correctionMove: '',\n  scrambleCompleted: false,\n  afterScramble: false,\n  inspectionTimeLeft: 15,\n  inspectionInterval: null,\n  solveInterval: null,\n  solveStartTime: 0,\n  inspectionStarted: false,\n  solveStarted: false,\n  firstSolveMoveReceived: false\n};\ndocument.addEventListener('DOMContentLoaded', async () => {\n  initCubeVisualization();\n  await initializeKPuzzle();\n  document.getElementById('generateScrambleButton').addEventListener('click', generateScramble);\n  document.getElementById('resetButton').addEventListener('click', resetScramble);\n});\nasync function initializeKPuzzle() {\n  const {\n    kpuzzle: getKPuzzle\n  } = cubing_puzzles__WEBPACK_IMPORTED_MODULE_4__.cube3x3x3;\n  state.kpuzzle = await getKPuzzle();\n  state.kpattern = state.kpuzzle.defaultPattern();\n  console.log('Initialized kpattern:', state.kpattern);\n}\nfunction initCubeVisualization() {\n  const container = document.getElementById('cube');\n  if (!container) {\n    console.error('No container element found with id \"cube\".');\n    return;\n  }\n  state.twistyPlayer = new cubing_twisty__WEBPACK_IMPORTED_MODULE_1__.TwistyPlayer({\n    puzzle: \"3x3x3\",\n    tempoScale: 5,\n    hintFacelets: \"none\",\n    background: \"none\",\n    controlPanel: \"none\",\n    backView: \"none\",\n    viewerLink: \"none\"\n  });\n  container.appendChild(state.twistyPlayer);\n  window.twistyPlayer = state.twistyPlayer;\n  console.log('twistyPlayer instance:', state.twistyPlayer);\n}\ndocument.getElementById('connectButton').addEventListener('click', async () => {\n  if (state.connection) {\n    state.connection.disconnect();\n    state.connection = null;\n    document.getElementById('connectButton').innerHTML = 'Connect';\n  } else {\n    await connectToCube();\n  }\n  requestAnimationFrame(animateCubeOrientation);\n});\nasync function connectToCube() {\n  try {\n    state.connection = await (0,gan_web_bluetooth__WEBPACK_IMPORTED_MODULE_2__.connectGanCube)(customMacAddressProvider);\n    state.connection.events$.subscribe(handleCubeEvent);\n    await state.connection.sendCubeCommand({\n      type: \"REQUEST_HARDWARE\"\n    });\n    await state.connection.sendCubeCommand({\n      type: \"REQUEST_BATTERY\"\n    });\n    await state.connection.sendCubeCommand({\n      type: \"REQUEST_FACELETS\"\n    });\n    document.getElementById('deviceName').value = state.connection.deviceName || '';\n    document.getElementById('deviceMAC').value = state.connection.deviceMAC || '';\n    document.getElementById('connectButton').innerHTML = 'Disconnect Cube';\n  } catch (error) {\n    console.error('Connection error:', error);\n    showPopupMessage('Failed to connect to the cube. Please try again.');\n  }\n}\nconst customMacAddressProvider = async (device, isFallbackCall) => {\n  if (isFallbackCall) {\n    return prompt('Unable to connect, please make sure the cube is solved and try again');\n  }\n};\nfunction handleCubeEvent(event) {\n  if (event.type === \"MOVE\") {\n    console.log(`Move: ${event.move}`);\n    handleMoveEvent(event.move);\n  } else if (event.type === \"FACELETS\") {\n    console.log(`Facelets event:`, event);\n    handleFaceletsEvent(event);\n  } else if (event.type === \"HARDWARE\") {\n    const hardwareNameElement = document.getElementById('hardwareName');\n    const hardwareVersionElement = document.getElementById('hardwareVersion');\n    const softwareVersionElement = document.getElementById('softwareVersion');\n    const gyroSupportedElement = document.getElementById('gyroSupported');\n    if (hardwareNameElement) hardwareNameElement.value = event.hardwareName || '';\n    if (hardwareVersionElement) hardwareVersionElement.value = event.hardwareVersion || '';\n    if (softwareVersionElement) softwareVersionElement.value = event.softwareVersion || '';\n    if (gyroSupportedElement) gyroSupportedElement.value = event.gyroSupported ? \"YES\" : \"NO\";\n  } else if (event.type === \"BATTERY\") {\n    const batteryLevelElement = document.getElementById('batteryLevel');\n    if (batteryLevelElement) batteryLevelElement.value = event.batteryLevel + '%';\n  } else if (event.type === \"DISCONNECT\") {\n    const infoInputs = document.querySelectorAll('.info input');\n    infoInputs.forEach(input => input.value = '');\n    document.getElementById('connectButton').innerHTML = 'Connect';\n  }\n}\nconst config = {\n  ignorePuzzleOrientation: true\n};\nfunction handleMoveEvent(move) {\n  if (!state.kpattern) {\n    console.log('kpattern not initialized. Move event ignored.');\n    return;\n  }\n  console.log('Move event:', move);\n  state.twistyPlayer.experimentalAddMove(move);\n  applyMoveToVirtualCube(move);\n  if (state.scrambleCompleted && !state.firstSolveMoveReceived) {\n    if (state.inspectionTimeLeft > 0) {\n      stopInspectionTimer();\n    }\n    state.firstSolveMoveReceived = true;\n    startSolveTimer();\n  }\n  if (!state.scrambleCompleted) {\n    if (!state.correctionMode) {\n      validateScrambleMove(move);\n    } else {\n      if (move === state.correctionMove || move === reverseMove(state.correctionMove)) {\n        state.correctionMode = false;\n        displayScrambleMoves();\n      }\n    }\n  }\n  try {\n    console.log('kpattern before solved check:', state.kpattern);\n    const isSolved = state.kpattern.experimentalIsSolved(config);\n    console.log('Is cube solved?', isSolved);\n    if (isSolved) {\n      showPopupMessage('Cube is solved!');\n      stopSolveTimer();\n    }\n  } catch (error) {\n    console.error('Error checking if cube is solved:', error);\n  }\n}\nfunction handleFaceletsEvent(event) {\n  const facelets = event.facelets;\n  console.log('Facelets event:', facelets);\n}\nfunction applyMoveToVirtualCube(move) {\n  if (!state.kpattern) {\n    console.error('kpattern is not defined. Cannot apply move.');\n    return;\n  }\n  const transformation = state.kpuzzle.moveToTransformation(move);\n  if (!transformation) {\n    console.error(`Transformation not found for move: ${move}`);\n    return;\n  }\n  try {\n    console.log('Current pattern before transformation:', state.kpattern);\n    state.kpattern = state.kpattern.applyTransformation(transformation);\n    console.log('Current pattern after transformation:', state.kpattern);\n  } catch (error) {\n    console.error('Error applying transformation:', error);\n  }\n}\nfunction showPopupMessage(message) {\n  const popup = document.getElementById('popupMessage');\n  popup.textContent = message;\n  popup.style.display = 'block';\n  setTimeout(() => {\n    popup.style.display = 'none';\n  }, 4000);\n}\nasync function generateScramble() {\n  try {\n    const scramble = await (0,cubing_scramble__WEBPACK_IMPORTED_MODULE_6__.randomScrambleForEvent)('333');\n    const scrambleText = scramble.toString();\n    state.scrambleMoves = scrambleText.split(' ');\n    state.currentScrambleIndex = 0;\n    state.correctionMode = false;\n    state.scrambleCompleted = false;\n    state.afterScramble = false;\n    state.inspectionStarted = false;\n    state.solveStarted = false;\n    state.firstSolveMoveReceived = false;\n    displayScrambleMoves();\n    console.log('Generated scramble:', scrambleText);\n  } catch (error) {\n    console.error('Error generating scramble:', error);\n    showPopupMessage('Failed to generate scramble. Please try again.');\n  }\n}\nfunction displayScrambleMoves() {\n  const scrambleDisplay = document.getElementById('scrambleDisplay');\n  scrambleDisplay.innerHTML = '';\n  const middleIndex = Math.ceil(state.scrambleMoves.length / 2);\n  state.scrambleMoves.forEach((move, index) => {\n    if (index === middleIndex) {\n      scrambleDisplay.appendChild(document.createElement('br'));\n    }\n    const moveElement = document.createElement('span');\n    moveElement.innerText = move;\n    moveElement.id = `scramble-move-${index}`;\n    moveElement.style.marginRight = '10px';\n    scrambleDisplay.appendChild(moveElement);\n  });\n}\nfunction validateScrambleMove(move) {\n  if (state.currentScrambleIndex >= state.scrambleMoves.length) {\n    return false;\n  }\n  const expectedMove = state.scrambleMoves[state.currentScrambleIndex];\n  const moveElement = document.getElementById(`scramble-move-${state.currentScrambleIndex}`);\n  console.log(`Validating Move: ${move}, Expected Move: ${expectedMove}`);\n  if (moveElement) {\n    if (expectedMove.includes('2')) {\n      const baseMove = expectedMove.replace('2', '');\n      if (!moveElement.dataset.completed) {\n        if (move === baseMove || move === `${baseMove}'`) {\n          moveElement.style.color = 'orange';\n          moveElement.dataset.completed = 'first';\n          console.log(`First half of double move completed: ${move}`);\n          return true;\n        }\n      } else if (moveElement.dataset.completed === 'first') {\n        if (move === baseMove || move === `${baseMove}'`) {\n          moveElement.style.color = 'limegreen';\n          moveElement.dataset.completed = 'second';\n          state.currentScrambleIndex++;\n          console.log(`Double move completed: ${move}`);\n          if (state.currentScrambleIndex >= state.scrambleMoves.length) {\n            scrambleCompleted();\n          }\n          return true;\n        }\n      }\n    } else if (move === expectedMove) {\n      moveElement.style.color = 'limegreen';\n      state.currentScrambleIndex++;\n      console.log(`Single move completed: ${move}`);\n      if (state.currentScrambleIndex >= state.scrambleMoves.length) {\n        scrambleCompleted();\n      }\n      return true;\n    } else {\n      const correctionMove = getCorrectionMove(expectedMove);\n      updateScrambleDisplay([correctionMove]);\n      state.correctionMode = true;\n      state.correctionMove = correctionMove;\n      console.log(`Incorrect move. Expected: ${expectedMove}, Correction: ${correctionMove}`);\n      return false;\n    }\n  } else {\n    console.error('Move element not found for index:', state.currentScrambleIndex);\n    return false;\n  }\n}\n\n// Function to handle scramble completion and start the inspection timer\nfunction scrambleCompleted() {\n  showPopupMessage(\"Start Inspection!\");\n  const scrambleDisplay = document.getElementById('scrambleDisplay');\n  scrambleDisplay.innerHTML = 'Start Inspection!';\n  console.log('Scramble completed.');\n  state.scrambleCompleted = true;\n  state.afterScramble = true;\n  startInspectionTimer();\n}\n\n// Function to start the inspection timer and set up move detection\nfunction startInspectionTimer() {\n  if (state.inspectionStarted) return; // Ensure the timer doesn't start if already running\n\n  clearInterval(state.inspectionInterval);\n  state.inspectionTimeLeft = 15;\n  document.getElementById('inspectionTimer').textContent = state.inspectionTimeLeft;\n  state.inspectionInterval = setInterval(() => {\n    if (state.inspectionTimeLeft > 0) {\n      state.inspectionTimeLeft--;\n      document.getElementById('inspectionTimer').textContent = state.inspectionTimeLeft;\n    } else {\n      stopInspectionTimer();\n      startSolveTimer();\n    }\n  }, 1000);\n  state.inspectionStarted = true;\n}\n\n// Function to stop the inspection timer\nfunction stopInspectionTimer() {\n  clearInterval(state.inspectionInterval);\n  state.inspectionStarted = false;\n}\n\n// Function to start the solve timer\nfunction startSolveTimer() {\n  if (state.solveStarted) return; // Ensure the timer doesn't start if already running\n\n  clearInterval(state.solveInterval);\n  state.solveStartTime = Date.now();\n  document.getElementById('solveTimer').textContent = '00:00:00';\n  state.solveInterval = setInterval(() => {\n    const elapsedTime = Date.now() - state.solveStartTime;\n    const minutes = Math.floor(elapsedTime / 60000);\n    const seconds = Math.floor(elapsedTime % 60000 / 1000);\n    const milliseconds = Math.floor(elapsedTime % 1000 / 10);\n    document.getElementById('solveTimer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;\n  }, 10);\n  state.solveStarted = true;\n}\nfunction stopSolveTimer() {\n  clearInterval(state.solveInterval);\n  const solveTime = document.getElementById('solveTimer').textContent;\n  saveSolveTime(solveTime);\n  state.solveStarted = false;\n}\nfunction saveSolveTime(time) {\n  // Convert time string to seconds\n  const [minutes, seconds, centiseconds] = time.split(':').map(Number);\n  const totalSeconds = minutes * 60 + seconds + centiseconds / 100;\n\n  // Don't save if the time is 0\n  if (totalSeconds === 0) {\n    console.log('Time of 0 not saved.');\n    return;\n  }\n  const sessionTimesList = document.getElementById('sessionTimes');\n  const listItem = document.createElement('li');\n  listItem.textContent = time;\n\n  // Insert the new time at the beginning of the list\n  if (sessionTimesList.firstChild) {\n    sessionTimesList.insertBefore(listItem, sessionTimesList.firstChild);\n  } else {\n    sessionTimesList.appendChild(listItem);\n  }\n  console.log('Solve time saved:', time);\n}\n\n// Function to reset the scramble and states\nfunction resetScramble() {\n  state.scrambleMoves = [];\n  state.currentScrambleIndex = 0;\n  state.moveHistory = [];\n  state.correctionMode = false;\n  state.correctionMove = '';\n  state.scrambleCompleted = false;\n  state.afterScramble = false;\n  state.inspectionStarted = false;\n  state.solveStarted = false;\n  document.getElementById('scrambleDisplay').innerHTML = '';\n  document.getElementById('inspectionTimer').textContent = '15';\n  document.getElementById('solveTimer').textContent = '00:00:00';\n  clearInterval(state.inspectionInterval);\n  clearInterval(state.solveInterval);\n  state.inspectionInterval = null;\n  state.solveInterval = null;\n  state.firstSolveMoveReceived = false;\n}\nfunction animateCubeOrientation() {\n  console.log(\"Animate cube orientation called\");\n}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./styles.css":
/*!**********************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./styles.css ***!
  \**********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/noSourceMaps.js */ \"./node_modules/css-loader/dist/runtime/noSourceMaps.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);\n// Imports\n\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, `body {\r\n    background: linear-gradient(to bottom, #114f84, #781384);\r\n    font-family: Arial, sans-serif;\r\n    margin: 0;\r\n    padding: 0;\r\n    min-height: 100vh;\r\n}\r\n\r\n.menu-bar {\r\n    width: 100%;\r\n    background-color: #182533;\r\n    color: white;\r\n    border-radius: 8px;\r\n}\r\n\r\n.menu-bar nav ul {\r\n    list-style-type: none;\r\n    margin: 0;\r\n    padding: 0;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    border-radius: 5px;\r\n}\r\n\r\n.menu-bar nav ul li {\r\n    margin: 0 15px;\r\n    border-radius: 5px;\r\n}\r\n\r\n.menu-bar nav ul li a {\r\n    color: white;\r\n    text-decoration: none;\r\n    padding: 14px 20px;\r\n    display: block;\r\n    border-radius: 5px;\r\n}\r\n\r\n.menu-bar nav ul li a:hover {\r\n    background-color: #17212b;\r\n    border-radius: 5px;\r\n}\r\n\r\n.container {\r\n  color: white;\r\n    display: flex;\r\n    flex-direction: column;\r\n    max-width: 1000px;\r\n    margin: 20px auto;\r\n    gap: 20px;\r\n}\r\n\r\n.sidebar {\r\n    width: 300px;\r\n    background-color: #182533;\r\n    padding: 10px;\r\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 1);\r\n    border-radius: 10px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: stretch;\r\n    position: fixed;\r\n    top: 60px; /* Adjust based on the height of your menu-bar */\r\n    bottom: 100px;\r\n    overflow-y: auto;\r\n}\r\n\r\n.left-sidebar {\r\n    left: 10px;\r\n}\r\n\r\n.right-sidebar {\r\n    right: 10px;\r\n}\r\n\r\n.logo {\r\n    height: 100px;\r\n    width: 700px;\r\n    margin-bottom: 3px;\r\n    border-radius: 10px;\r\n\r\n}\r\n\r\n.button-container {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: stretch;\r\n    gap: 10px;\r\n    margin-bottom: 20px;\r\n    align-items: stretch;\r\n}\r\n\r\n.info {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: stretch;\r\n    gap: 10px;\r\n    color: white;\r\n}\r\n\r\n.info-item {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 5px;\r\n    border-bottom: 1px;\r\n}\r\n\r\n.info-item img {\r\n    width: 15px;\r\n    height: 15px;\r\n}\r\n\r\n.info-item input {\r\n    border: none;\r\n    background-color: transparent;\r\n    font-size: 11px;\r\n    font-weight: bold;\r\n}\r\n\r\n.main-content {\r\n    flex: auto;\r\n    max-width: 600px;\r\n    margin-left: auto;; /* Adjust based on sidebar width + margin */\r\n    margin-right: auto;; /* Adjust based on sidebar width + margin */\r\n    padding: 5px;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.cube-section {\r\n    background-color: #182533;\r\n    padding: 20px;\r\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 1);\r\n    border-radius: 10px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n\r\n}\r\n\r\n.cube-container {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n\r\n}\r\n\r\n#cube {\r\n    width: 300px;\r\n    height: 300px;\r\n    background-color: #transparent;\r\n    border-radius: 30px;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\n#scrambleDisplay {\r\n    font-size: 18px;\r\n    font-weight: bold;\r\n    padding: 10px;\r\n    width: 400px;\r\n    text-align: center;\r\n    border: 0px solid #ccc; /* Optional: border for visual boundary */\r\n    border-radius: 10px;\r\n\r\n}\r\n\r\n\r\n\r\n.timer-container {\r\n    font-size: 48px;\r\n    text-align: center;\r\n    background-color: #182533;\r\n    padding: 20px;\r\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 1);\r\n    border-radius: 10px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    margin-bottom: 15px;\r\n    color: #bcbcbc;\r\n}\r\n\r\n.session-section {\r\n  background-color: #182533;\r\n  padding: 5px;\r\n\r\n  border-radius: 10px;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\n.session-times {\r\n    width: 100%;\r\n    text-align: left; /* Align text within this container to the left */\r\n    padding: 10px;\r\n}\r\n\r\n.session-times ul {\r\n    list-style: none;\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\n.session-times ul li {\r\n    padding: 5px;\r\n    border-bottom: 1px solid #ccc;\r\n    font-size: 14px;\r\n    text-align: left; /* Align text within list items to the left */\r\n    margin: 5px 0;\r\n}\r\n\r\nbutton {\r\n    background-color: #0e1621;\r\n    color: white;\r\n    padding: 12px 20px;\r\n    border: none;\r\n    border-radius: 5px;\r\n    cursor: pointer;\r\n    font-size: 16px;\r\n    font-weight: normal;\r\n     width: 100%;\r\n    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\r\n    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;\r\n}\r\n\r\nbutton:hover {\r\n    background-color: #1b3251;\r\n    transform: translateY(-2px);\r\n    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);\r\n}\r\n\r\nbutton:active {\r\n    background-color: #264f7c;\r\n    transform: translateY(0);\r\n    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n.stats {\r\n    display: flex;\r\n    flex-direction:  row;\r\n    align-items: center;\r\n    gap: 10px;\r\n}\r\n\r\n.stats p {\r\n    margin: 5px 0;\r\n}\r\n\r\n.stats span {\r\n    font-weight: bold;\r\n}\r\n\r\nfooter {\r\n    position:  absolute;\r\n    bottom: 0;\r\n    width: 100%;\r\n    background-color: #17212b;\r\n    color: white;\r\n    text-align: center;\r\n    padding: 0px 0;\r\n    border-radius: 10px;\r\n    flex: auto;\r\n\r\n}\r\n\r\n.modal {\r\n    display: none;\r\n    position: fixed;\r\n    z-index: 1;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    overflow: auto;\r\n    background-color: rgb(0,0,0);\r\n    background-color: rgba(0,0,0,0.4);\r\n}\r\n\r\n.modal-content {\r\n    background-color: #fefefe;\r\n    margin: 15% auto;\r\n    padding: 20px;\r\n    border: 1px solid #888;\r\n    width: 80%;\r\n}\r\n\r\n.close-button {\r\n    color: #aaa;\r\n    float: right;\r\n    font-size: 28px;\r\n    font-weight: bold;\r\n}\r\n\r\n.close-button:hover,\r\n.close-button:focus {\r\n    color: black;\r\n    text-decoration: none;\r\n    cursor: pointer;\r\n}\r\n\r\n.popup-message {\r\n    display: none;\r\n    position: fixed;\r\n    top: 20px;\r\n    left: 50%;\r\n    transform: translateX(-50%);\r\n    background-color: #4caf50;\r\n    color: white;\r\n    padding: 15px;\r\n    border-radius: 5px;\r\n    z-index: 1000;\r\n    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);\r\n    animation: fadeInOut 4s forwards;\r\n}\r\n\r\n.popup-header {\r\n    font-size: 20px;\r\n    font-weight: bold;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.popup-body {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 10px;\r\n}\r\n\r\n.popup-item {\r\n    font-size: 16px;\r\n    background-color: #fff;\r\n    color: #333;\r\n    padding: 10px;\r\n    border-radius: 5px;\r\n    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n@keyframes fadeInOut {\r\n    0% {\r\n        opacity: 0;\r\n        top: 0px;\r\n    }\r\n    10% {\r\n        opacity: 1;\r\n        top: 20px;\r\n    }\r\n    90% {\r\n        opacity: 1;\r\n        top: 20px;\r\n    }\r\n    100% {\r\n        opacity: 0;\r\n        top: 0px;\r\n    }\r\n}\r\n\r\n.chart-container {\r\n    width: 80%;\r\n    height: 400px;\r\n    margin: 3px 3px;\r\n    padding: 10px;\r\n    background-color: white;\r\n    border-radius: 10px;\r\n    box-sizing: border-box;\r\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\r\n}\r\n`, \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack:///./styles.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/cubing/dist/lib/cubing/chunks lazy recursive referencedExports: Worker":
/*!************************************************************************************************************!*\
  !*** ./node_modules/cubing/dist/lib/cubing/chunks/ lazy referencedExports: Worker strict namespace object ***!
  \************************************************************************************************************/
/***/ ((module) => {

eval("function webpackEmptyAsyncContext(req) {\n\t// Here Promise.resolve().then() is used instead of new Promise() to prevent\n\t// uncaught exception popping up in devtools\n\treturn Promise.resolve().then(() => {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t});\n}\nwebpackEmptyAsyncContext.keys = () => ([]);\nwebpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;\nwebpackEmptyAsyncContext.id = \"./node_modules/cubing/dist/lib/cubing/chunks lazy recursive referencedExports: Worker\";\nmodule.exports = webpackEmptyAsyncContext;\n\n//# sourceURL=webpack:///./node_modules/cubing/dist/lib/cubing/chunks/_lazy_referencedExports:_Worker_strict_namespace_object?");

/***/ }),

/***/ "./styles.css":
/*!********************!*\
  !*** ./styles.css ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleDomAPI.js */ \"./node_modules/style-loader/dist/runtime/styleDomAPI.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertBySelector.js */ \"./node_modules/style-loader/dist/runtime/insertBySelector.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ \"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertStyleElement.js */ \"./node_modules/style-loader/dist/runtime/insertStyleElement.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleTagTransform.js */ \"./node_modules/style-loader/dist/runtime/styleTagTransform.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!./node_modules/css-loader/dist/cjs.js!./styles.css */ \"./node_modules/css-loader/dist/cjs.js!./styles.css\");\n\n      \n      \n      \n      \n      \n      \n      \n      \n      \n\nvar options = {};\n\noptions.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());\noptions.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());\noptions.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, \"head\");\noptions.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());\noptions.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"], options);\n\n\n\n\n       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals : undefined);\n\n\n//# sourceURL=webpack:///./styles.css?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		// data-webpack is not used as build has no uniqueName
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 		
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;