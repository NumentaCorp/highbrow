// Numenta Platform for Intelligent Computing (NuPIC)
// Copyright (C)  2017, Numenta, Inc.  Unless you have an agreement
// with Numenta, Inc., for a separate license for this software code, the
// following terms and conditions apply:
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero Public License version 3 as
// published by the Free Software Foundation.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU Affero Public License for more details.
// You should have received a copy of the GNU Affero Public License
// along with this program.  If not, see http://www.gnu.org/licenses.
// http://numenta.org/licenses/
using System.Collections;
using UnityEngine;

namespace Numenta.Renderable
{
    public class MiniColumn : MonoBehaviour
    {
        public enum State
        {
            Inactive,
            Active
        }

        public MiniColumnParameters parameters = MiniColumnParameters.DEFAULT;
        [Tooltip("Current Minicolumn state")]
        public State state = State.Inactive;

        IEnumerator InstantiateCells()
        {
            GameObject prefab = Resources.Load("prefabs/Neuron") as GameObject;
            int numOfCells = parameters.numOfCells;
            float cellSpacing = parameters.cellSpacing;
            float cellSize = parameters.cellSize;

			float margin = cellSpacing / (cellSpacing + cellSize);

			// Scale each cell height based on number of cells per column
			float height = 1.0f / numOfCells;
            float scaledMargin = margin / numOfCells;
            Vector3 size = new Vector3(1 - margin, height - scaledMargin, 1 - margin);
            for (int i = 0; i < numOfCells; i++)
            {
                Vector3 location = new Vector3(0, i * height * 2 - 1, 0);
                var cell = Instantiate(prefab, transform);
                cell.transform.localScale = size * 2;
                cell.transform.localPosition = location;
                cell.name = "Cell " + (i + 1);
                var neuron = cell.GetComponent<Neuron>();
                neuron.cerllType = parameters.cellType;
            }
            yield return null;
        }

        public Neuron GetNeuron(int i)
        {
            return transform.GetChild(i).GetComponent<Neuron>();
        }

        /// <summary>
        /// Start is called on the frame when a script is enabled just before
        /// any of the Update methods is called the first time.
        /// </summary>
        void Start()
        {
            // Scale column based on number of cells per column and cell size
            float cellSize = (parameters.cellSize + parameters.cellSpacing);
            Vector3 extents = new Vector3(cellSize, parameters.numOfCells * cellSize / 2, cellSize);
            transform.localScale = extents;
            // Move bottom of cylinder to bottom of column
            transform.localPosition += extents.y * Vector3.up;
            StartCoroutine(InstantiateCells());
        }

        /// <summary>
        /// Update is called every frame, if the MonoBehaviour is enabled.
        /// </summary>
        void Update()
        {
            UpdateState();
        }
        State _oldState = State.Inactive;
        void UpdateState()
        {
            if (state == _oldState)
            {
                return;
            }
            Renderer rend = gameObject.GetComponent<Renderer>();
            switch (state)
            {
                case State.Active:
                    rend.enabled = true;
                    break;
                case State.Inactive:
                    rend.enabled = false;
                    break;
                default:
					rend.enabled = false;
					break;
            }
            _oldState = state;
        }
        /// <summary>
        /// Callback to draw gizmos that are pickable and always drawn.
        /// </summary>
        void OnDrawGizmos()
        {
            Vector3 size = new Vector3(parameters.cellSize,
                            parameters.numOfCells * (parameters.cellSize + parameters.cellSpacing),
                            parameters.cellSize);
            Gizmos.color = new Color(1, 0, 0, 0.5f);
            Gizmos.DrawCube(transform.position + size.y * Vector3.up / 2, size);
        }
    }
}
