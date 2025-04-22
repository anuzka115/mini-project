// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY David Galles ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

import Graph, { LARGE_SIZE, SMALL_SIZE } from './Graph.js';
import { addControlToAlgorithmBar, addDivisorToAlgorithmBar } from './Algorithm.js';
import { act } from '../anim/AnimationMain';

const SMALL_COST_TABLE_WIDTH = 30;
const SMALL_COST_TABLE_HEIGHT = 30;
const SMALL_COST_TABLE_START_X = 40;
const SMALL_COST_TABLE_START_Y = 70;

const SMALL_PATH_TABLE_WIDTH = 30;
const SMALL_PATH_TABLE_HEIGHT = 30;
const SMALL_PATH_TABLE_START_X = 330;
const SMALL_PATH_TABLE_START_Y = 70;

const SMALL_NODE_1_X_POS = 50;
const SMALL_NODE_1_Y_POS = 400;
const SMALL_NODE_2_X_POS = 150;
const SMALL_NODE_2_Y_POS = 350;
const SMALL_NODE_3_X_POS = 250;
const SMALL_NODE_3_Y_POS = 400;

const SMALL_MESSAGE_X = 400;
const SMALL_MESSAGE_Y = 350;

const LARGE_COST_TABLE_WIDTH = 20;
const LARGE_COST_TABLE_HEIGHT = 20;
const LARGE_COST_TABLE_START_X = 40;
const LARGE_COST_TABLE_START_Y = 50;

const LARGE_PATH_TABLE_WIDTH = 20;
const LARGE_PATH_TABLE_HEIGHT = 20;
const LARGE_PATH_TABLE_START_X = 500;
const LARGE_PATH_TABLE_START_Y = 50;

const LARGE_NODE_1_X_POS = 50;
const LARGE_NODE_1_Y_POS = 500;
const LARGE_NODE_2_X_POS = 150;
const LARGE_NODE_2_Y_POS = 450;
const LARGE_NODE_3_X_POS = 250;
const LARGE_NODE_3_Y_POS = 500;

const LARGE_MESSAGE_X = 300;
const LARGE_MESSAGE_Y = 450;

export default class Floyd extends Graph {
	constructor(am, w, h) {
		super(am, w, h, [], false, false, true);
		this.addControls();
	}

	addControls() {
		this.startButton = addControlToAlgorithmBar('Button', 'Run');
		this.startButton.onclick = this.startCallback.bind(this);

		addDivisorToAlgorithmBar();

		super.addControls();
		this.smallGraphButton.onclick = this.smallGraphCallback.bind(this);
		this.largeGraphButton.onclick = this.largeGraphCallback.bind(this);
	}

	reset() {
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				this.costTable[i][j] = this.adj_matrix[i][j];
				if (this.costTable[i][j] >= 0) {
					this.pathTable[i][j] = i;
				} else {
					this.pathTable[i][j] = -1;
				}
			}
		}
	}

	smallGraphCallback() {
		if (this.size !== SMALL_SIZE) {
			this.animationManager.resetAll();
			this.animationManager.setAllLayers([0, 32, this.currentLayer]);
			this.logicalButton.disabled = false;
			this.adjacencyListButton.disabled = false;
			this.adjacencyMatrixButton.disabled = false;
			this.setup_small();
		}
	}

	largeGraphCallback() {
		// if (this.size !== LARGE_SIZE) {
		// 	this.animationManager.resetAll();
		// 	//this.animationManager.setAllLayers([0]);
		// 	this.logicalButton.disabled = true;
		// 	this.adjacencyListButton.disabled = true;
		// 	this.adjacencyMatrixButton.disabled = true;
		// 	this.setup_large();
		// }
	}

	getCostLabel(value, alwaysUseINF) {
		alwaysUseINF = alwaysUseINF === undefined ? false : alwaysUseINF;
		if (value >= 0) {
			return String(value);
		} else if (this.size === SMALL_SIZE || alwaysUseINF) {
			return 'INF';
		} else {
			return '';
		}
	}

	setup_small() {
		this.cost_table_width = SMALL_COST_TABLE_WIDTH;
		this.cost_table_height = SMALL_COST_TABLE_HEIGHT;
		this.cost_table_start_x = SMALL_COST_TABLE_START_X;
		this.cost_table_start_y = SMALL_COST_TABLE_START_Y;

		this.path_table_width = SMALL_PATH_TABLE_WIDTH;
		this.path_table_height = SMALL_PATH_TABLE_HEIGHT;
		this.path_table_start_x = SMALL_PATH_TABLE_START_X;
		this.path_table_start_y = SMALL_PATH_TABLE_START_Y;

		this.node_1_x_pos = SMALL_NODE_1_X_POS;
		this.node_1_y_pos = SMALL_NODE_1_Y_POS;
		this.node_2_x_pos = SMALL_NODE_2_X_POS;
		this.node_2_y_pos = SMALL_NODE_2_Y_POS;
		this.node_3_x_pos = SMALL_NODE_3_X_POS;
		this.node_3_y_pos = SMALL_NODE_3_Y_POS;

		this.message_x = SMALL_MESSAGE_X;
		this.message_y = SMALL_MESSAGE_Y;
		super.setup_small();
	}

	setup_large() {
		this.cost_table_width = LARGE_COST_TABLE_WIDTH;
		this.cost_table_height = LARGE_COST_TABLE_HEIGHT;
		this.cost_table_start_x = LARGE_COST_TABLE_START_X;
		this.cost_table_start_y = LARGE_COST_TABLE_START_Y;

		this.path_table_width = LARGE_PATH_TABLE_WIDTH;
		this.path_table_height = LARGE_PATH_TABLE_HEIGHT;
		this.path_table_start_x = LARGE_PATH_TABLE_START_X;
		this.path_table_start_y = LARGE_PATH_TABLE_START_Y;

		this.node_1_x_pos = LARGE_NODE_1_X_POS;
		this.node_1_y_pos = LARGE_NODE_1_Y_POS;
		this.node_2_x_pos = LARGE_NODE_2_X_POS;
		this.node_2_y_pos = LARGE_NODE_2_Y_POS;
		this.node_3_x_pos = LARGE_NODE_3_X_POS;
		this.node_3_y_pos = LARGE_NODE_3_Y_POS;

		this.message_x = LARGE_MESSAGE_X;
		this.message_y = LARGE_MESSAGE_Y;

		super.setup_large();
	}

	setup() {
		super.setup();
		this.commands = [];

		this.costTable = new Array(this.size);
		this.pathTable = new Array(this.size);
		this.costTableID = new Array(this.size);
		this.pathTableID = new Array(this.size);
		this.pathIndexXID = new Array(this.size);
		this.pathIndexYID = new Array(this.size);
		this.costIndexXID = new Array(this.size);
		this.costIndexYID = new Array(this.size);

		this.node1ID = this.nextIndex++;
		this.node2ID = this.nextIndex++;
		this.node3ID = this.nextIndex++;

		let i;
		for (i = 0; i < this.size; i++) {
			this.costTable[i] = new Array(this.size);
			this.pathTable[i] = new Array(this.size);
			this.costTableID[i] = new Array(this.size);
			this.pathTableID[i] = new Array(this.size);
		}

		const costTableHeader = this.nextIndex++;
		const pathTableHeader = this.nextIndex++;

		this.cmd(
			act.createLabel,
			costTableHeader,
			'Cost Table',
			this.cost_table_start_x,
			this.cost_table_start_y - 2 * this.cost_table_height,
			0,
		);
		this.cmd(
			act.createLabel,
			pathTableHeader,
			'Path Table',
			this.path_table_start_x,
			this.path_table_start_y - 2 * this.path_table_height,
			0,
		);

		for (i = 0; i < this.size; i++) {
			this.pathIndexXID[i] = this.nextIndex++;
			this.pathIndexYID[i] = this.nextIndex++;
			this.costIndexXID[i] = this.nextIndex++;
			this.costIndexYID[i] = this.nextIndex++;
			this.cmd(
				act.createLabel,
				this.pathIndexXID[i],
				i,
				this.path_table_start_x + i * this.path_table_width,
				this.path_table_start_y - this.path_table_height,
			);
			this.cmd(act.setTextColor, this.pathIndexXID[i], '#0000FF');
			this.cmd(
				act.createLabel,
				this.pathIndexYID[i],
				i,
				this.path_table_start_x - this.path_table_width,
				this.path_table_start_y + i * this.path_table_height,
			);
			this.cmd(act.setTextColor, this.pathIndexYID[i], '#0000FF');

			this.cmd(
				act.createLabel,
				this.costIndexXID[i],
				i,
				this.cost_table_start_x + i * this.cost_table_width,
				this.cost_table_start_y - this.cost_table_height,
			);
			this.cmd(act.setTextColor, this.costIndexXID[i], '#0000FF');
			this.cmd(
				act.createLabel,
				this.costIndexYID[i],
				i,
				this.cost_table_start_x - this.cost_table_width,
				this.cost_table_start_y + i * this.cost_table_height,
			);
			this.cmd(act.setTextColor, this.costIndexYID[i], '#0000FF');
			for (let j = 0; j < this.size; j++) {
				this.costTable[i][j] = this.adj_matrix[i][j];
				if (this.costTable[i][j] >= 0) {
					this.pathTable[i][j] = i;
				} else {
					this.pathTable[i][j] = -1;
				}
				this.costTableID[i][j] = this.nextIndex++;
				this.pathTableID[i][j] = this.nextIndex++;
				this.cmd(
					act.createRectangle,
					this.costTableID[i][j],
					this.getCostLabel(this.costTable[i][j], true),
					this.cost_table_width,
					this.cost_table_height,
					this.cost_table_start_x + j * this.cost_table_width,
					this.cost_table_start_y + i * this.cost_table_height,
				);
				this.cmd(
					act.createRectangle,
					this.pathTableID[i][j],
					this.pathTable[i][j],
					this.path_table_width,
					this.path_table_height,
					this.path_table_start_x + j * this.path_table_width,
					this.path_table_start_y + i * this.path_table_height,
				);
			}
		}
		this.animationManager.startNewAnimation(this.commands);
		this.animationManager.skipForward();
		this.animationManager.clearHistory();
		if (this.size === LARGE_SIZE) {
			this.animationManager.setAllLayers([0]);
		}
	}

	startCallback() {
		this.implementAction(this.doFloydWarshall.bind(this));
	}

	doFloydWarshall() {
		this.commands = [];

		const oldIndex = this.nextIndex;
		const messageID = this.nextIndex++;
		const moveLabel1ID = this.nextIndex++;
		const moveLabel2ID = this.nextIndex++;

		this.cmd(act.createCircle, this.node1ID, '', this.node_1_x_pos, this.node_1_y_pos);
		this.cmd(act.createCircle, this.node2ID, '', this.node_2_x_pos, this.node_2_y_pos);
		this.cmd(act.createCircle, this.node3ID, '', this.node_3_x_pos, this.node_3_y_pos);
		this.cmd(act.createLabel, messageID, '', this.message_x, this.message_y, 0);

		for (let k = 0; k < this.size; k++) {
			for (let i = 0; i < this.size; i++) {
				for (let j = 0; j < this.size; j++) {
					if (i !== j && j !== k && i !== k) {
						this.cmd(act.setText, this.node1ID, i);
						this.cmd(act.setText, this.node2ID, k);
						this.cmd(act.setText, this.node3ID, j);
						this.cmd(
							act.connect,
							this.node1ID,
							this.node2ID,
							'#009999',
							-0.1,
							1,
							this.getCostLabel(this.costTable[i][k], true),
						);
						this.cmd(
							act.connect,
							this.node2ID,
							this.node3ID,
							'#9900CC',
							-0.1,
							1,
							this.getCostLabel(this.costTable[k][j], true),
						);
						this.cmd(
							act.connect,
							this.node1ID,
							this.node3ID,
							'#CC0000',
							0,
							1,
							this.getCostLabel(this.costTable[i][j], true),
						);
						this.cmd(act.setHighlight, this.costTableID[i][k], 1);
						this.cmd(act.setHighlight, this.costTableID[k][j], 1);
						this.cmd(act.setHighlight, this.costTableID[i][j], 1);
						this.cmd(act.setTextColor, this.costTableID[i][k], '#009999');
						this.cmd(act.setTextColor, this.costTableID[k][j], '#9900CC');
						this.cmd(act.setTextColor, this.costTableID[i][j], '#CC0000');
						if (this.costTable[i][k] >= 0 && this.costTable[k][j] >= 0) {
							if (
								this.costTable[i][j] < 0 ||
								this.costTable[i][k] + this.costTable[k][j] < this.costTable[i][j]
							) {
								this.cmd(
									act.setText,
									messageID,
									this.getCostLabel(this.costTable[i][k], true) +
										' + ' +
										this.getCostLabel(this.costTable[k][j], true) +
										' < ' +
										this.getCostLabel(this.costTable[i][j], true),
								);
								this.cmd(act.step);
								this.costTable[i][j] = this.costTable[i][k] + this.costTable[k][j];
								this.cmd(act.setText, this.pathTableID[i][j], '');
								this.cmd(act.setText, this.costTableID[i][j], '');
								this.cmd(
									act.createLabel,
									moveLabel1ID,
									this.pathTable[k][j],
									this.path_table_start_x + j * this.path_table_width,
									this.path_table_start_y + k * this.path_table_height,
								);
								this.cmd(
									act.move,
									moveLabel1ID,
									this.path_table_start_x + j * this.path_table_width,
									this.path_table_start_y + i * this.path_table_height,
								);
								this.cmd(
									act.createLabel,
									moveLabel2ID,
									this.costTable[i][j],
									this.message_x,
									this.message_y,
								);
								this.cmd(act.setHighlight, moveLabel2ID, 1);
								this.cmd(
									act.move,
									moveLabel2ID,
									this.cost_table_start_x + j * this.cost_table_width,
									this.cost_table_start_y + i * this.cost_table_height,
								);
								this.pathTable[i][j] = this.pathTable[k][j];
								this.cmd(act.step);
								this.cmd(act.setText, this.costTableID[i][j], this.costTable[i][j]);
								this.cmd(act.setText, this.pathTableID[i][j], this.pathTable[i][j]);
								this.cmd(act.delete, moveLabel1ID);
								this.cmd(act.delete, moveLabel2ID);
							} else {
								this.cmd(
									act.setText,
									messageID,
									'!(' +
										this.getCostLabel(this.costTable[i][k], true) +
										' + ' +
										this.getCostLabel(this.costTable[k][j], true) +
										' < ' +
										this.getCostLabel(this.costTable[i][j], true) +
										')',
								);
								this.cmd(act.step);
							}
						} else {
							this.cmd(
								act.setText,
								messageID,
								'!(' +
									this.getCostLabel(this.costTable[i][k], true) +
									' + ' +
									this.getCostLabel(this.costTable[k][j], true) +
									' < ' +
									this.getCostLabel(this.costTable[i][j], true) +
									')',
							);
							this.cmd(act.step);
						}
						this.cmd(act.setTextColor, this.costTableID[i][k], '#000000');
						this.cmd(act.setTextColor, this.costTableID[k][j], '#000000');
						this.cmd(act.setTextColor, this.costTableID[i][j], '#000000');
						this.cmd(act.disconnect, this.node1ID, this.node2ID);
						this.cmd(act.disconnect, this.node2ID, this.node3ID);
						this.cmd(act.disconnect, this.node1ID, this.node3ID);
						this.cmd(act.setHighlight, this.costTableID[i][k], 0);
						this.cmd(act.setHighlight, this.costTableID[k][j], 0);
						this.cmd(act.setHighlight, this.costTableID[i][j], 0);
					}
				}
			}
		}
		this.cmd(act.delete, this.node1ID);
		this.cmd(act.delete, this.node2ID);
		this.cmd(act.delete, this.node3ID);
		this.cmd(act.delete, messageID);
		this.nextIndex = oldIndex;

		return this.commands;
	}
}
