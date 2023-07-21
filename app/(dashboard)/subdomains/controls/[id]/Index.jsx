"use client";
import React from "react";
import { createRoot } from "react-dom/client";

//Bootstrap and jQuery libraries
// import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";

import $ from "jquery";
import Cookies from "js-cookie";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/api/axios";

const Index = ({ id }) => {
  const token = Cookies.get("AT");
  const router = useRouter();
  // $(function () {
  // Client-side-only code
  //   if (typeof window === "undefined") {
  //     return <p>loading...</p>;
  //   }

  // });
  useUpdateEffect(() => {
    //initialize datatable
    $("#controls_index").DataTable({
      ajax: {
        url: `${BASE_URL}/organizations/sub-domains/${id}/controls`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      searching: false,
      paging: false,
      info: false,
      processing: true,
      serverSide: true,
      columns: [
        // colum names..
        { data: "name", searchable: true, orderable: true },
        { data: "code", searchable: true, orderable: true },
        { data: "created_at", searchable: true, orderable: true },
      ],
      columnDefs: [],
    });
  }, []);
  return (
    <table id="controls_index" className="display compact pt-3">
      <thead className="bg-primary text-white">
        <tr>
          <th>Name</th>
          <th className="self-center">Code</th>
          <th>Created At</th>
        </tr>
      </thead>
    </table>
  );
};

export default Index;
