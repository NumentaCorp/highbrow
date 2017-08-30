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
using System;
using System.Collections;

namespace Numenta.Renderable
{
    public class CorticalColumn : MonoBehaviour
    {
        [Tooltip("Column Parameters")]
        public CorticalColumnParameters parameters;

        /// <summary>
        /// Calculate the Column size based on the given <see cref="CorticalColumnParameters"/>.
        /// </summary>
        /// <returns>The column size in local coordinates</returns>
        /// <param name="parameters">Parameters used to calculate the size</param>
        public static Vector3 GetSize(CorticalColumnParameters parameters)
        {
            Vector3 size = new Vector3();
            var layers = parameters.layers;
            if (layers != null)
            {
                for (int i = 0; i < layers.Length; i++)
                {
                    Vector3 layerSize = Layer.GetSize(layers[i]);
                    size.x = Math.Max(size.x, layerSize.x);
                    size.y += layerSize.y + parameters.spacing;
                    size.z = Math.Max(size.z, layerSize.z);
                }
                // Remove spacing from top
                size.y -= parameters.spacing;
            }
            return size;
        }

        /// <summary>
        /// Instantiates the layers. Each Layer will be positioned below 
        /// the preceeding Layer
        /// </summary>
        /// <returns>The layers.</returns>
        IEnumerator InstantiateLayers()
        {
            GameObject prefab = Resources.Load("prefabs/Layer") as GameObject;
            var layers = parameters.layers;
            if (layers != null && layers.Length > 0)
            {
                Vector3 colsize = GetSize(parameters);
                Vector3 size = Layer.GetSize(layers[0]);
                Vector3 offset = (colsize.y - size.y) / 2 * Vector3.down;
                Vector3 location = transform.position + offset;
                for (int i = layers.Length - 1; i >= 0; i--)
                {
                    GameObject obj = Instantiate(prefab);
                    Layer layer = obj.GetComponent<Layer>();
                    layer.parameters = layers[i];
                    layer.transform.localPosition = location;
                    layer.transform.parent = transform;

                    size = Layer.GetSize(layers[i]);
                    location.y += size.y + parameters.spacing;
                }
            }
            yield return null;
        }

        #region MonoBehaviour

        void Start()
        {
            StartCoroutine(InstantiateLayers());
            this.name = parameters.name;
        }

        void OnDrawGizmos()
        {
            Gizmos.color = new Color(0, 1, 0, 0.15f);
            Gizmos.matrix = transform.localToWorldMatrix;
            Vector3 size = GetSize(parameters);
            Gizmos.DrawCube(Vector3.zero, size);
            Handles.Label(transform.position + size.y * Vector3.up / 2, parameters.name);
        }
        #endregion
    }
}