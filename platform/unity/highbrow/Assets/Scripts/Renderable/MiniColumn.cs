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
using UnityEditor;
using UnityEngine;

namespace Numenta.Renderable
{
    /// <summary>
    /// This class represents a single MiniColumn composed of <see cref="Neuron"/> 
    /// </summary>
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

        // Cached state
        State _oldState = State.Inactive;

        /// <summary>
        /// Calculate the minicolumn size based on the given <see cref="MiniColumnParameters"/>.
        /// </summary>
        /// <returns>The minicolumn size in local coordinates</returns>
        /// <param name="parameters">Parameters used to calculate the size</param>
		public static Vector3 GetSize(MiniColumnParameters parameters)
        {
            int numOfCells = parameters.numOfCells;
            float cellSpacing = parameters.spacing;
            float cellSize = parameters.cellSize;
            float cellHeight = cellSize + cellSpacing;
            return new Vector3(cellSize, numOfCells * cellHeight, cellSize);
        }

        public Neuron GetNeuron(int i)
        {
            return transform.GetChild(i).GetComponent<Neuron>();
        }

        /// <summary>
        /// Coroutine used to instantiate all neurons 
        /// </summary>
        /// <returns></returns>
        IEnumerator InstantiateCells()
        {
            GameObject prefab = Resources.Load("prefabs/Neuron") as GameObject;

            // Scale each cell height based on number of cells per column
            float cellSpacing = parameters.spacing;
            float cellSize = parameters.cellSize;
            float cellHeight = cellSize + cellSpacing;
            int numOfCells = parameters.numOfCells;

            Vector3 pos = transform.position;
            pos.y -= cellHeight * numOfCells / 2;
            Vector3 size = new Vector3(cellSize, cellSize, cellSize);
            for (int i = 0; i < numOfCells; i++)
            {
                var cell = Instantiate(prefab);
                cell.transform.localPosition = pos;
                cell.transform.localScale = size;
                cell.transform.parent = transform;
                cell.name = "Cell " + (i + 1);
                var neuron = cell.GetComponent<Neuron>();
                neuron.cerllType = parameters.cellType;
                pos.y += cellHeight;
            }

            yield return null;
        }

        #region MonoBehaviour

        void Start()
        {
            // Cylinder height is double width
            Vector3 size = GetSize(parameters);
            size.y /= 2;
            transform.localScale = size;
            StartCoroutine(InstantiateCells());
        }

        void Update()
        {
            if (state == _oldState)
            {
                return;
            }
            // Show or hide the minicolum depending on the state
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
        void OnDrawGizmos()
        {
            if (EditorApplication.isPlaying) return;

            Gizmos.color = new Color(1, 0, 0, 0.5f);
            Gizmos.matrix = transform.localToWorldMatrix;
            Gizmos.DrawCube(Vector3.zero, GetSize(parameters));
        }
        #endregion
    }
}
