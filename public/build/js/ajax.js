$(".nav-item.item-user-li, .refresh-users-list").on("click", function () {
	$("#list-users tbody").html("");
	$.ajax({
		       url: $("#path-getListUser").val(),
		       context: ""
	       })
	 .done(function (result) {
		$("#list-users tbody").html("");
		constructListTabUser(result);
		$("#list-users").DataTable();
		$(".line-profil > td:not(:last-child)").on("click", function () {
			getListProfil($(this));
		});
		$(".line-profil > td:last-child").bind("click", function () {
			delteUserByID($(this));
		});

		$("#user-structures").html("");
	});
});

/**
 *
 * @param $row
 */
function getListProfil($row) {
	var iduser = $row.parent().data("iduser");
	console.log(iduser);
	if (iduser) {
		$.ajax({
			       type: "POST",
			       url: $("#path-getStructureFromUser").val(),
			       data: {'iduser': iduser},
			       success: function (result) {
				       result = JSON.parse(result);
				       console.log(result);
				       profilUser.id = iduser;
				       createElementStructProfil(result);
				       $(".struct-user-list").on("click", function () {
					       showCalcul($(this));
				       });
			       }
		       });
	}
}

function delteUserByID($row) {
	if(confirm("Confirmez-vous la suppression ?")){
		var iduser = $row.parent().data("iduser");
		console.log(iduser);
		if (iduser) {
			$.ajax({
				       type: "POST",
				       url: $("#path-delteUserByID").val(),
				       data: {'iduser': iduser},
				       success: function (result) {
					       console.log(result);
					       $(".refresh-users-list").click();
				       }

			       });
		}
	}
}

/**
 *
 * @param $obj
 * @param typeCalcul
 * @param typeStruct
 */
function saveCalcul($objSol, $obLestage, $objDo, typeStructure) {
	if ($objSol) {
		var infoEvent = "";
		if (typeStructure == typeStruct.portique) {
			infoEvent = infosEventPortique;
		} else if (typeStructure == typeStruct.totem) {
			infoEvent = infosEventTotem;
		} else if (typeStructure == typeStruct.tour) {
			infoEvent = infosEventTour;
		}
		$.ajax({
			       type: "POST",
			       url: $("#path-saveCalcul").val(),
			       data: {
				       'dataSol': $objSol,
				       'dataLestage': $obLestage,
				       'dataDo': $objDo,
				       'typeCalcul': typeCalcul,
				       'typeStruct': typeStructure,
				       'infosEvent': infoEvent
			       },
			       success: function (result) {
				       console.log(result);
				       result = result.lastInsertId;
				       if ($.isNumeric(result) && result > 0) {
					       if (typeStruct.portique == typeStructure) {
						       $(".div-export-pdf-portique").css("display", "block");
						       $(".div-export-pdf-portique > .l-export-pdf").attr("href", "/exportPDF/" + result);
						       $('.card-portique').animate({
							                               scrollTop: $(".div-export-pdf-portique").offset().top
						                               }, 2000);
					       }
					       if (typeStruct.tour == typeStructure) {
						       $(".div-export-pdf-tour").css("display", "block");
						       $(".div-export-pdf-tour > .l-export-pdf").attr("href", "/exportPDF/" + result);
						       $('.card-tour').animate({
							                               scrollTop: $(".div-export-pdf-tour").offset().top
						                               }, 1000);
					       }
					       if (typeStruct.totem == typeStructure) {
						       $(".div-export-pdf-totem").css("display", "block");
						       $(".div-export-pdf-totem > .l-export-pdf").attr("href", "/exportPDF/" + result);
						       $('.card-totem').animate({
							                               scrollTop: $(".div-export-pdf-totem").offset().top
						                               }, 2000);
					       }
				       } else {
					       alert("Un problème est survenu.");
				       }
			       }
		       });
	}
}

/**
 *
 * @param $elem
 */
function showCalcul($elem) {
	var id = profilUser.id;
	var struct = $elem.data("struct");
	$.ajax({
		       type: "POST",
		       url: $("#path-showCalcul").val(),
		       data: {'iduser': id, 'typeStruct': struct},
		       success: function (result) {
			       console.log(result);
			       result = JSON.parse(result);
			       //$elem.after(result);
			       var list = showCalculByStruc(result, struct);
			       removeGoodBoxCaluclDetailProfil(struct);
			       $elem.after(list);
		       }
	       });
}

// $(".btn-export-pdf").on("click",function(){
// 	$.ajax({
// 		type: "POST",
// 		url: $("#path-test").val(),
// 		data: {},
// 		success: function(result) {
// 		   console.log(result);
// 		}
// 	});
// });

