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
    /// This class represents a single layer composed of <see cref="MiniColumn"/> 
    /// </summary>
    public class Layer : MonoBehaviour
    {
        public LayerParameters parameters = LayerParameters.DEFAULT;

        /// <summary>
        /// Calculate the Layer size based on the given <see cref="LayerParameters"/>.
        /// </summary>
        /// <returns>The layer size in local coordinates</returns>
        /// <param name="parameters">Parameters used to calculate the size</param>
        public static Vector3 GetSize(LayerParameters parameters)
        {
            Vector3 columnSize = MiniColumn.GetSize(parameters.minicolumnParameters);
            float x = parameters.dimensions.x;
            float y = parameters.dimensions.y;
            float spacing = parameters.spacing;
            return new Vector3(x * (columnSize.x + spacing),  
                               columnSize.y, 
                               y * (columnSize.z + spacing));
        }

        public MiniColumn GetMinicolumn(int i)
        {
            return transform.GetChild(i).GetComponent<MiniColumn>();
        }

        /// <summary>
        /// Coroutine used to instantiate all minicolumns 
        /// </summary>
        /// <returns></returns>
        IEnumerator InstantiateMinicolumns()
        {
            GameObject prefab = Resources.Load("prefabs/MiniColumn") as GameObject;

            int dimX = (int)parameters.dimensions.x;
            int dimY = (int)parameters.dimensions.y;

            Vector3 size = GetSize(parameters);
			float width = size.x / dimX;
			float depth = size.z / dimY;

            Vector3 location = transform.position;
            location.x -= (size.x - width) / 2;
            location.z -= (size.z - depth) / 2;
			for (int x = 0; x < dimX; x++)
            {
                for (int y = 0; y < dimY; y++)
                {
                    var col = Instantiate(prefab);
                    col.name = $"Column {x + 1}, {y + 1}";
                    var minicolumn = col.GetComponent<MiniColumn>();
                    minicolumn.parameters = parameters.minicolumnParameters;

                    col.transform.localPosition = location + new Vector3(x * width, 0, y * depth);
                    col.transform.parent = transform;
                }
            }
            yield return null;
        }

        IEnumerator Blink(Neuron cell, Neuron.State state, float seconds = 1f)
        {
            cell.state = state;
            yield return new WaitForSeconds(seconds);
            cell.state = Neuron.State.Inactive;
        }

        IEnumerator Blink(MiniColumn col, MiniColumn.State state, float seconds = 1f)
        {
            col.state = state;
            yield return new WaitForSeconds(seconds);
            col.state = MiniColumn.State.Inactive;
        }

        #region MonoBehaviour

        void Start()
        {
            StartCoroutine(InstantiateMinicolumns());
            this.name = parameters.name;
        }

        void Update()
        {
            int i = (int)(Random.value * transform.childCount);
            var col = GetMinicolumn(i);
            int j = (int)(Random.value * parameters.minicolumnParameters.numOfCells);
            var cell = col.GetNeuron(j);
            if (j == 0)
            {
                StartCoroutine(Blink(col, MiniColumn.State.Active));
            }
            if (i % 2 == 0)
            {
                StartCoroutine(Blink(cell, Neuron.State.Active));
            }
            else
            {
                StartCoroutine(Blink(cell, Neuron.State.Depolarized));
            }
        }

        void OnDrawGizmos()
        {
            //if (EditorApplication.isPlaying) return;

            Gizmos.color = new Color(0, 1, 0, 0.5f);
            Gizmos.matrix = transform.localToWorldMatrix;
            Gizmos.DrawCube(Vector3.zero, GetSize(parameters));
            Handles.Label(transform.position, parameters.name);
        }
        #endregion
    }
}
