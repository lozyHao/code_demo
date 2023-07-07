const intrumentList = [
  {
    name: "电勾",
    type: "instrument_electrichook",
    color: "#3d7ef8",
    list: [
      {
        type: "line",
        point_stard: 5,
        point_end: 12,
      },
      {
        type: "point",
        point: 30,
      },
    ],
  },
  {
    name: "穿刺鞘",
    type: "instrument_puncturesheath",
    color: "#43f83d",
    list: [
      {
        type: "point",
        point: 10,
      },
      {
        type: "point",
        point: 65,
      },
    ],
  },
  {
    name: "分离钳",
    type: "instrument_separationforceps",
    color: "#f8dc3d",
    list: [
      {
        type: "line",
        point_stard: 5,
        point_end: 12,
      },
      {
        type: "line",
        point_stard: 20,
        point_end: 70,
      },
    ],
  },
];

export default intrumentList;
