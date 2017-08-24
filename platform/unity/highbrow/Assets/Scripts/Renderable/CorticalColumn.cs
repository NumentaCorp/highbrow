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
using UnityEngine;
using UnityEditor;
using System.Collections;

namespace Numenta.Renderable
{
    public class CorticalColumn : MonoBehaviour
    {
        [Tooltip("Column Parameters")]
        public CorticalColumnParameters parameters;

        /// <summary>
        /// Instantiates the layers. Each Layer will be positioned below 
        /// the preceeding Layer
        /// </summary>
        /// <returns>The layers.</returns>
        IEnumerator InstantiateLayers()
        {
            GameObject prefab = Resources.Load("prefabs/Layer") as GameObject;
            float yPos = 0;
            var layers = parameters.layers;
            for (int i = layers.Length - 1; i >= 0; i--)
            {
                GameObject obj = Instantiate(prefab, transform);
                Layer layer = obj.GetComponent<Layer>();
                layer.parameters = layers[i];

                float cellSize = layer.parameters.minicolumnParameters.cellSize;
                float cellSpacing = layer.parameters.minicolumnParameters.cellSpacing;
                float halfWidth = (cellSize + cellSpacing) / 2f;
                float spacing = layer.parameters.spacing;
                Vector3 size = layer.GetSize();
                Vector3 location = new Vector3(-halfWidth, yPos, -halfWidth);
                yPos += spacing + size.y;
                layer.transform.localPosition = location;
            }
            yield return null;
        }

        void Start()
        {
            StartCoroutine(InstantiateLayers());
            this.name = parameters.name;
        }

        void OnDrawGizmos()
        {
            float yPos = 0;
            Gizmos.color = new Color(0, 1, 0, 0.5f);
            var layers = parameters.layers;
            if (layers != null)
            {
                for (int i = layers.Length - 1; i >= 0; i--)
                {
                    float cellSize = layers[i].minicolumnParameters.cellSize;
                    float cellSpacing = layers[i].minicolumnParameters.cellSpacing;
                    int numOfCells = layers[i].minicolumnParameters.numOfCells;
                    float spacing = layers[i].spacing;
                    float x = layers[i].dimensions.x;
                    float y = layers[i].dimensions.y;

                    float cellWidth = cellSize + cellSpacing;
                    Vector3 size = new Vector3(cellWidth * x, numOfCells * cellWidth, cellWidth * y);
                    Vector3 offset = new Vector3(-cellWidth, yPos + size.y / 2, -cellWidth);
                    yPos += spacing + size.y;
                    Gizmos.DrawCube(transform.position + offset, size);
                    Handles.Label(transform.position + offset, layers[i].name);
                }
            }
            Handles.Label(transform.position + yPos * Vector3.up, parameters.name);
        }
    }
}