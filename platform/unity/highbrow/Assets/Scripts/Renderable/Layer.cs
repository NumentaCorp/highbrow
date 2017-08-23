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
    public class Layer : MonoBehaviour
    {
        public LayerParameters parameters = LayerParameters.DEFAULT;

        /// <summary>
        /// Instantiate all minicolumns
        /// </summary>
        /// <returns></returns>
        IEnumerator InstantiateMinicolumns()
        {
            var cellSize = parameters.minicolumnParameters.cellSize;
            var cellSpacing = parameters.minicolumnParameters.cellSpacing;
            int dimX = (int)parameters.dimensions.x;
            int dimY = (int)parameters.dimensions.y;
            var halfX = dimX / 2;
            GameObject prefab = Resources.Load("prefabs/MiniColumn") as GameObject;
            for (int x = 0; x < dimX; x++)
            {
                for (int y = 0; y < dimY; y++)
                {
                    Vector3 location = new Vector3(
                        (x - halfX) * (cellSize + cellSpacing),
                        0,
                        (y - halfX) * (cellSize + cellSpacing));
                    var col = Instantiate(prefab, transform);
                    var minicolumn = col.GetComponent<MiniColumn>();
                    minicolumn.parameters = parameters.minicolumnParameters;
                    col.transform.localPosition = location;
                    col.name = $"Column {x + 1}, {y + 1}";
                }
            }
            yield return null;
        }

        public MiniColumn GetMinicolumn(int i)
        {
            return transform.GetChild(i).GetComponent<MiniColumn>();
        }

        /// <summary>
        /// Start is called on the frame when a script is enabled just before
        /// any of the Update methods is called the first time.
        /// </summary>
        void Start()
        {
            StartCoroutine(InstantiateMinicolumns());
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
        /// <summary>
        /// Update is called every frame, if the MonoBehaviour is enabled.
        /// </summary>
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
        /// <summary>
        /// Callback to draw gizmos that are pickable and always drawn.
        /// </summary>
        void OnDrawGizmos()
        {
            Gizmos.color = new Color(0, 1, 0, 0.5f);
            var cellSize = parameters.minicolumnParameters.cellSize;
            var cellSpacing = parameters.minicolumnParameters.cellSpacing;
            var numOfCells = parameters.minicolumnParameters.numOfCells;
            var x = parameters.dimensions.x;
            var y = parameters.dimensions.y;
            Vector3 size = new Vector3((cellSize + cellSpacing) * x,
                            numOfCells * (cellSize + cellSpacing),
                            (cellSize + cellSpacing) * y);
            Vector3 offset = new Vector3(
                -(cellSize + cellSpacing) / 2,
                size.y / 2,
                -(cellSize + cellSpacing) / 2);
            Gizmos.DrawCube(transform.position + offset, size);
        }
    }
}
