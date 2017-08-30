// Copyright(C)  2017, Numenta, Inc.Unless you have an agreement
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
using System.Collections;
using UnityEditor;
using System;

namespace Numenta.Renderable
{

    public class Network : MonoBehaviour
    {
        [Tooltip("Network Parameters")]
        public NetworkParameters parameters;

		public static Vector3 GetSize(NetworkParameters parameters)
		{
			Vector3 size = new Vector3();
			var columns = parameters.columns;
			if (columns != null)
			{
				float spacing = 0;
				for (int i = 0; i < columns.Length; i++)
				{
					Vector3 columnSize = CorticalColumn.GetSize(columns[i]);
					size.x += columnSize.x + spacing;
					size.y = Math.Max(size.y, columnSize.y);
					size.z = Math.Max(size.z, columnSize.z);
					spacing = columns[i].spacing;
				}
			}
			return size;
		}

		IEnumerator InstantiateColumns()
        {
            GameObject prefab = Resources.Load("prefabs/Column") as GameObject;
            var columns = parameters.columns;
            if (columns != null && columns.Length > 0)
            {
				Vector3 networkSize = GetSize(parameters);
				Vector3 size = CorticalColumn.GetSize(columns[0]);
                Vector3 offset = (networkSize.x - size.x) / 2 * Vector3.left;
				Vector3 location = transform.position + offset;
				for (int i = 0; i < columns.Length; i++)
                {
                    GameObject obj = Instantiate(prefab);
                    CorticalColumn col = obj.GetComponent<CorticalColumn>();
                    col.parameters = columns[i];
					col.transform.localPosition = location;
					col.transform.parent = transform;

					size = CorticalColumn.GetSize(columns[i]);
					location.x += size.x + columns[i].spacing;
				}
                yield return null;
            }
        }

        #region MonoBehaviour

        // Use this for initialization
        void Start()
        {
            StartCoroutine(InstantiateColumns());
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