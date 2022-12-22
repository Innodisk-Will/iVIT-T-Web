///////////////////////////////// INITIAL /////////////////////////////////////
///////////////////////////////// INITIAL /////////////////////////////////////
///////////////////////////////// INITIAL /////////////////////////////////////

// Setting dataset numbers
function setting_dataset(){
    // Setting show type
    $("#type").text(TYPE_NAME);
    if (ITER_NAME == undefined){
        set_iter_name = "workspace"
    }
    else{
        set_iter_name = ITER_NAME
        // Remove upload/label btn
        change_iter_action();
    }
    let front_param = {"iteration":set_iter_name}
    ALL_CLASSES_API = iter_cls_num_api(MAIN_UUID, front_param);
    if (ALL_CLASSES_API["All"] === 0){
        check_dataset();
    }
    else{
        // Remove if _temp problem
        if (Object.keys(ALL_CLASSES_API["classes_num"]).includes("_temp")){
            delete ALL_CLASSES_API["classes_num"]["_temp"]
        };
        // Set filter classes
        filter_classes_btn(ALL_CLASSES_API["All"],
                            ALL_CLASSES_API["classes_num"],
                            ALL_CLASSES_API["Unlabeled"],);
        // Setting show dataset number
        // get_dataset_num(PRJ_INFO["effect_img_nums"], PRJ_INFO["total_img_nums"]);
    };
};

// Remove upload/label btn
function change_iter_action(){
    $("#upload_btn").css("display","none");
    $("#more_btn").attr("style","margin-right: 0px !important");
    $("#label_btn_container").css("visibility","hidden");
    // Remove option in more
    $("#more_drop").html(`<li><a id="del_iter" class="dropdown-item" onclick="open_deliter_mkpopup()">Delete_iteration</a></li>`);
};

// Setting dataset numbers
function get_dataset_num(effect_num, total_num){
    $(`#dataset_num`).text(effect_num+"/"+total_num);
};

// Every check dataset is upload image
function check_dataset(){
    if (PRJ_INFO["total_img_nums"]<1){
        $("#graph_container").css("display","none");
        $("#null_dataset_container").css("display","flex");
    };
};

///////////////////////////////// DELETE ITERATION /////////////////////////////////////
///////////////////////////////// DELETE ITERATION /////////////////////////////////////
///////////////////////////////// DELETE ITERATION /////////////////////////////////////

// Open delete_mkpopup
function open_deliter_mkpopup(){
    document.getElementById("deliter_mkpopup").style.display = "block";
};

// Close rename_mkpopup
function close_deliter_mkpopup(){
    document.getElementById("deliter_mkpopup").style.display = "none";
};

///////////////////////////////// FILTER CLASSES BUTTON /////////////////////////////////////
///////////////////////////////// FILTER CLASSES BUTTON /////////////////////////////////////
///////////////////////////////// FILTER CLASSES BUTTON /////////////////////////////////////

// Show filter classes btn
function filter_classes_btn(all, classes, unlabeled){
    // Append all btn
    DATASET_CLASSES["keys"].push("All");
    DATASET_CLASSES["values"].push(all);
    // Append Unlabeled
    if (unlabeled>0){
        DATASET_CLASSES["keys"].push("Unlabeled");
        DATASET_CLASSES["values"].push(unlabeled);
    };
    // Append individual class
    for (let cls_name of Object.keys(classes)){
        DATASET_CLASSES["keys"].push(cls_name);
        DATASET_CLASSES["values"].push(classes[cls_name]);
        ALL_CLASSES["keys"].push(cls_name);
        ALL_CLASSES["values"].push(classes[cls_name]);
    };
    // Get total of added div
    let total = DATASET_CLASSES["keys"].length;
    if (DATASET_CLASSES["keys"].length>4){
        total = 4;
    };
    // Create div
    let html = gen_classes_btn(total);
    
    // Append to HTML
    $("#cls_container").append(html).ready(function(){
        show_cls_name_number(total);
        $("#class_outside_0").css("border","2px solid #E61F23");
        $("#class_0").css("opacity","1");
        $("#class_num_0").css("opacity","1");
    });
};

// Element classes btn generator()
function gen_classes_btn(total){
    let html = "";
    // Create 5~6 div
    for (let num = 0; num<total; num++){
        // Element
        let h5=`
                <div id="class_outside_${num}" class="class_container_css class_container" onclick="">
                    <div id="class_${num}" class="class_name_container text-truncate multiline_text user-select-none"></div>
                    <div id="class_num_${num}" class="num_container"></div>
                </div>
            `;
        html = html.concat(h5);
    };

    return html
}

// Show classes name and number
function show_cls_name_number(total){
    // Show classes name and number
    for (let num = 0; num<total; num++){
        // Get all btn onclick
        if (num==0){
            $(`#class_outside_${num}`).attr("onclick",'get_all_image()');
        }
        else{
            $(`#class_outside_${num}`).attr("onclick",`filter_small_img('${DATASET_CLASSES["keys"][num]}')`);
        };
        // Give div text
        give_cls_txt(num, num);
    };
    // Show expand btn 
    if (DATASET_CLASSES["keys"].length>total){
        // Give css for expand_more
        $("#expand_cls_more").css("opacity","1");
        $("#expand_cls_more").css("cursor","pointer");
        $("#expand_cls_more").attr("onclick",`expand_cls_btn('more', '${total}')`);
    };
};

// Change filter button
function expand_cls_btn(key, total){
    // Get first text
    let firset_txt = $("#class_0").text();
    let index = DATASET_CLASSES["keys"].indexOf(firset_txt);
    if (key=="more"){
        let expand = parseInt(index)+parseInt(total);
        // Show classes name and number
        for (let num = 0; num<total; num++){
            if (num+expand < DATASET_CLASSES["keys"].length){
                // Get all btn onclick
                $(`#class_outside_${num}`).attr("onclick",`filter_small_img('${DATASET_CLASSES["keys"][num+expand]}')`);
                // Give div text
                give_cls_txt(num, num+expand);
            }
            else{
                // hidden last div
                $(`#class_outside_${num}`).css("visibility","hidden");
            };
        };
        // While value is last, then expand_cls_more remove
        if ( parseInt(expand) + parseInt(total) >= DATASET_CLASSES["keys"].length){
            $("#expand_cls_more").css("opacity","0.4");
            $("#expand_cls_more").css("cursor","");
            $("#expand_cls_more").attr("onclick",``);
        };
        // Give css for expand_less
        $("#expand_cls_less").css("opacity","1");
        $("#expand_cls_less").css("cursor","pointer");
        $("#expand_cls_less").attr("onclick",`expand_cls_btn('less', '${total}')`);
        // Remove select div
        remove_select_cls();
    }
    else{
        // Show classes name and number
        for (let num = 0; num<total; num++){
            // Get all btn onclick
            if (index - (total-num)==0){
                $(`#class_outside_${num}`).attr("onclick",'get_all_image()');
            }
            else{
                $(`#class_outside_${num}`).attr("onclick",`filter_small_img('${DATASET_CLASSES["keys"][index - (total-num)]}')`);
            };
            // Give div text
            give_cls_txt(num, index - (total-num));
            $(`#class_outside_${num}`).css("visibility","visible");
        };
        //While value is first, then expand_cls_less remove
        if (parseInt(index)-parseInt(total)==0){
            $("#expand_cls_less").css("opacity","0.4");
            $("#expand_cls_less").css("cursor","");
            $("#expand_cls_less").attr("onclick",``);
        };
        // Give css for expand_more
        $("#expand_cls_more").css("opacity","1");
        $("#expand_cls_more").css("cursor","pointer");
        $("#expand_cls_more").attr("onclick",`expand_cls_btn('more', '${total}')`);
        // Remove select div
        remove_select_cls();
    };
};

// Give text of div(class)
function give_cls_txt(num, index){
    $(`#class_${num}`).text(DATASET_CLASSES["keys"][index]);
    $(`#class_num_${num}`).text(DATASET_CLASSES["values"][index]);
    hover_marquee(`class_${num}`);
};

// Listen onclick cls btn
function onclick_listener_btn(){
    $( document ).on({"click.classimages":function(e) {
        // Class btn
        if  (e.target["id"].includes("class")){
            id_class(e);
        };

        // img btn
        if  (e.target["id"].includes("image")){
            id_image(e);
        };

        // Stop event
        e.stopPropagation();
    }});
};

// Id has "class" action
function id_class(e){
    // Remove select div
    remove_select_cls();
    // Append css
    if (!e.target["id"].includes("outside")){
        $($(e.target).parent()).css("border","2px solid #E61F23");
        let childs = $($(e.target).parent()).children();
        $(childs[0]).css("opacity","1");
        $(childs[1]).css("opacity","1");
    }
    else{
        $(e.target).css("border","2px solid #E61F23");
        let childs = $(e.target).children();
        $(childs[0]).css("opacity","1");
        $(childs[1]).css("opacity","1");
    };
    // First image select
    init_preview_img();
    // Check preview expand btn
    check_preview_expand();
    // Clean box -> because selec null class still box in image
    // $("#boxes").html("");
};

// Id has "image" action
function id_image(e){
    // Remove select div
    remove_select_img();
    // Append css
    if (e.target["id"].includes("div")){
        $(e.target).css("border","2px solid #E61F23");
        // selected img to preview
        select_img($(e.target).children()[0]);
    }
    else{
        $($(e.target).parent()).css("border","2px solid #E61F23");
        // selected img to preview
        select_img(e.target);
    };
};

// Remove select_cls
function remove_select_cls(){
    let selector =  $("#cls_container div[style*='border: 2px solid rgb(230, 31, 35);']");
    // exclude have hidden problem
    if (selector[0] != undefined && selector[0]["style"]["visibility"] == "hidden"){
        // $(selector[0]).removeAttr( "style","border: 2px solid rgb(230, 31, 35);" );
        $(selector[0]).css( "border","");
        $(selector[0]).attr( "style","visibility:hidden;" );
    }
    else{
        // $(selector[0]).removeAttr( "style","border: 2px solid rgb(230, 31, 35);" );
        $(selector[0]).css( "border","");
    };
    let childs = $(selector[0]).children();
    $(childs[0]).removeAttr("style");
    $(childs[1]).removeAttr("style");
};

///////////////////////////////// SMALL IMAGE /////////////////////////////////////
///////////////////////////////// SMALL IMAGE /////////////////////////////////////
///////////////////////////////// SMALL IMAGE /////////////////////////////////////

// Remove select_img
function remove_select_img(index=0){
    if ($("#label_div").children().length>0){
        let selector =  $("#label_smallimg_container div[style*='border: 2px solid rgb(230, 31, 35);']");
        // $(selector[index]).removeAttr( "style","border: 2px solid rgb(230, 31, 35);" );
        $(selector[index]).css( "border","");
    }
    else{
        let selector =  $("#small_img_container div[style*='border: 2px solid rgb(230, 31, 35);']");
        // $(selector[index]).removeAttr( "style","border: 2px solid rgb(230, 31, 35);" );
        $(selector[index]).css( "border","");
    }
};

// Filter small image
function filter_small_img(class_name){
    // Update new array
    ALL_PAHT = []
    if (ITER_NAME == undefined){
        iteration = "workspace";
    }
    else{
        iteration = ITER_NAME;
    };
    let front_param = {"iteration":iteration, "class_name":class_name};
    let img_info = filter_dataset_api(MAIN_UUID, front_param);

    // Clean old image
    $(`#small_img_container`).html("");
    // Show new image
    for (let img of img_info["img_path"]){
        show_small_img(img);
    };
};

// Get all image
function get_all_image(){
    // Update new array
    ALL_PAHT = []
    check = false
    if (ITER_NAME == undefined){
        iteration = "workspace";
        if (PRJ_INFO["total_img_nums"]>0){
            check = true
        };
    }
    else{
        iteration = ITER_NAME;
        check = true
    };
    if (check){
        let front_param = {"iteration":iteration, "class_name":"All"};
        let img_info = filter_dataset_api(MAIN_UUID, front_param);
        // Clean old image
        $(`#small_img_container`).html("");
        // Show new image
        for (let img of img_info["img_path"]){
            show_small_img(img);
        };
    };
};

// Show small img
function show_small_img(img_path){
    path_split = img_path.split("/");
    path_split.splice(path_split.indexOf('.'), 1);
    let text_path = path_split.toString();
    let new_path = text_path.replace(/,/g, '/');
    img_path = `${SCRIPT_ROOT}/display_img/${new_path}`;
    [id_name, org_name, cls] = get_src_info(path_split);
    ALL_PAHT.push([id_name, org_name, cls]);
    if (ITER_NAME == undefined){
        html=`
                <div id="image_div" class="small_img_container">
                    <img id="image" src="${img_path}" class="show_image lazyload" loading="lazy">
                    <span id=${id_name}_${cls} class="material-symbols-outlined selectbox_css selectbox_null" onclick="select_img_action('${id_name}','${org_name}','${cls}')">
                        radio_button_unchecked
                    </span>
                </div>
            `;
    }
    else{
        html=`
                <div id="image_div" class="small_img_container">
                    <img id="image" src="${img_path}" class="show_image lazyload" loading="lazy">
                </div>
            `;
    };
    $(`#small_img_container`).append(html);
};

function get_src_info(path_split){
    id_name = path_split[path_split.length-1].split(".")[0]
    org_name = path_split[path_split.length-1]
    cls = path_split[path_split.length-2] != "" ? path_split[path_split.length-2] : "Unlabled";
    return [id_name, org_name, cls]
}
///////////////////////////////// SELECT /////////////////////////////////////
///////////////////////////////// SELECT /////////////////////////////////////
///////////////////////////////// SELECT /////////////////////////////////////

// Select action
function select_img_action(id, img_name, cls){
    if ($(`#${id}_${cls}`).html().includes("check_circle")){
        // change new icon
        $(`#${id}_${cls}`).html("radio_button_unchecked");
        $(`#${id}_${cls}`).removeAttr("style");
        // Removed opacity
        $(`#${id}_${cls}`).parent().css("opacity","");
        // Removed select img
        SELECT_IMGS = SELECT_IMGS.filter(function(el) { return el[cls] != img_name;});
        // Prevent event
        if (SELECT_IMGS.length == 0){
            stop_other_action("remove");
        };
        update_sel_count();
    }
    else{
        // change new icon
        $(`#${id}_${cls}`).html("check_circle")
        $(`#${id}_${cls}`).attr("style","font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' -25, 'opsz' 40;color: #57b8ff;")
        // Add opacity
        parent =  $(`#${id}`).parent();
        old = parent.attr("style");
        if (old == undefined){
            old = "";
        };
        parent.attr("style",old + "opacity:0.7;");
        // Collect select img
        SELECT_IMGS.push({[cls]:img_name})
        // Prevent event
        if (SELECT_IMGS.length == 1){
            stop_other_action("stop");
        };
        update_sel_count();
    };

    if (ALL_PAHT.length == SELECT_IMGS.length){
        $("#sel_all").val("Cancel");
    }
    else{
        $("#sel_all").val("Select all");
    };
};

// Stop other action(preview/filter stop)
function stop_other_action(key){
    if(key == "stop"){
        $('#cls_container').css("pointer-events","none");
        $('#expand_cls_less').css("pointer-events","none");
        $('#expand_cls_more').css("pointer-events","none");
        $('.filter_cls_container').css("cursor","not-allowed");
        // Stop orginal action
        $(document).off('click.classimages');
        // Change new action
        $( document ).on({"click.images":function(e) {
            // img btn
            if  (e.target["id"].includes("image")){
                // DIV -> Child -> SRC
                if (e.target["id"].includes("div")){
                    path_split = $(e.target).children()[0]["src"].split("/");
                } // IMAGE -> SRC
                else{
                    path_split = e.target["src"].split("/");
                };
                [id_name, org_name, cls] = get_src_info(path_split);
                select_img_action(id_name, org_name, cls);
            };
            // Stop event
            e.stopPropagation();
        }});
        // Count panel
        $(".count_box_function_div").css("display","flex");

    }
    else{
        $('#cls_container').css("pointer-events","");
        $('#expand_cls_less').css("pointer-events","");
        $('#expand_cls_more').css("pointer-events","");
        $('.filter_cls_container').css("cursor","");
        $(document).off('click.images');
        onclick_listener_btn();
        // Remove Count panel
        $(".count_box_function_div").css("display","none");
        // Update select all
        $("#sel_all").css("pointer-events","");
    };
};

// Update select nubmer
function update_sel_count(){
    let sel_list =  $("#cls_container div[style*='border: 2px solid rgb(230, 31, 35);']")[0]['id'].split("_");
    let idx = parseInt(sel_list[sel_list.length-1]);
    var total = DATASET_CLASSES["values"][idx];
    var count = SELECT_IMGS.length;
    $('.count_bottom_div').text(`${count}/${total}`);
};

// Cancle action
function cancle_sel_panal(){
    // Remove Count panel
    // $(".count_box_function_div").css("display","none");
    // Cancle all select
    for (let obj of SELECT_IMGS){
        img_name = Object.values(obj)[0]
        cls = Object.keys(obj)[0]
        id = img_name.split(".")[0]
        select_img_action(id, img_name, cls)
    };
};

// Select all
function select_all(){
    all_select = ALL_PAHT.length == SELECT_IMGS.length
    Promise.all(ALL_PAHT.map(val =>  stauts_select(val, all_select)))
    // for (let list of ALL_PAHT){
    //     var status = SELECT_IMGS.filter(function(el) { return el[list[2]] == list[1];}).length == 0

    //     if (status || all_select){
    //         select_img_action(list[0], list[1], list[2]);
    //         if (ALL_PAHT.length == SELECT_IMGS.length){
    //             $("#sel_all").val("Cancel");
    //         }
    //         else{
    //             $("#sel_all").val("Select all");
    //         };
    //     };
    // };;
};

function stauts_select(list, all_select){
    const promises = new Promise((resolve) => {
        var status = SELECT_IMGS.filter(function(el) { return el[list[2]] == list[1];}).length == 0
        if (status || all_select){
            select_img_action(list[0], list[1], list[2]);

            resolve(true);
        };
    });
    return promises
};

function getScrollTop(){
    $(window).scroll(function () {
        var scrollVal = $(this).scrollTop();
        if (scrollVal > 30){
            $(".count_box_function_div").css("bottom","10px");
        }
        else{
            $(".count_box_function_div").css("bottom","");
        }
    });
};

///////////////////////////////// DELETE_IMAGE /////////////////////////////////////
///////////////////////////////// DELETE_IMAGE /////////////////////////////////////
///////////////////////////////// DELETE_IMAGE /////////////////////////////////////

function change_delete_mkpop(){
    $("#deliter_label").text("Delete images");
    $("#del_content").text("Are you sure you want to delete these images?");
    $("#delete_btn").attr("onclick","delete_imgs()")
    open_deliter_mkpopup();
};

function delete_imgs(){
    if (ALL_PAHT.length == SELECT_IMGS.length){
        delete_all_img_api(MAIN_UUID);
        // Refresh panel
        setTimeout('myrefresh()',50);
    }
    else{
        var front_param = {"image_info":{ }}
        for (let val of SELECT_IMGS){
            if (! Object.keys(front_param["image_info"]).includes(Object.keys(val)[0])){
                front_param["image_info"][Object.keys(val)[0]]=[Object.values(val)[0]]
            }
            else{
                front_param["image_info"][Object.keys(val)[0]].push(Object.values(val)[0])
            };
        };
        delete_img_api(MAIN_UUID, front_param);
        // Refresh panel
        setTimeout('myrefresh()',50);
    };
};
///////////////////////////////// PREVIEW /////////////////////////////////////
///////////////////////////////// PREVIEW /////////////////////////////////////
///////////////////////////////// PREVIEW /////////////////////////////////////

// Initail preview img
function init_preview_img(){
    let first_img_div = $("#small_img_container").children()[0];
    // Give choice css
    $(first_img_div).css("border","2px solid #E61F23");
    // Get src
    if ($(first_img_div).children().length>0){
        let src = $(first_img_div).children()[0]["src"];
        preview_img(src, "preview_img");
    }
    else{
        let src = "";
        preview_img(src, "preview_img");
    };
};

// select preview img 
function select_img(e){
    let src = e["src"];
    if ($("#label_div").children().length>0){
        preview_img(src, "large_img");
    }
    else{
        preview_img(src, "preview_img");
    };
};

// Preview img
function preview_img(src, id, img_name=null){
    // // Reset rectangle
    // SAVE_INFO["image_size"] = IMAGE_SIZE;
    // SAVE_INFO["save_rect"] = RECTANGLES;
    RECTANGLES = [];
    MARQUEE_RECT= {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
    // Clean box -> because selec null class still box in image
    $("#boxes").html("");

    // Dataset page is show
    if (MAIN_PAGE == "dataset"){
        // Remove old html in img_cls_show_container
        remove_img_cls();
        // Get img cls
        if (src!=""){
            img_show_class(src);
        };
    };

    // Show img
    $(`#${id}`).attr("src",src).on("load",function(){
        // Check type show box
        if (TYPE_NAME == "object_detection"){
            // Append box to panel
            show_box(this, img_name);
            // Remove load event
            $(this).unbind("load");
            // Point action
            if ($("#point").attr("style")=="color: #57b8ff;"){
                point();
            };
        }
        else{
            if (MAIN_PAGE=="model"){
                filter_eval(img_name);
            };
        };
    });
};

// If small_img_container is null, then get out expand
function check_preview_expand(){
    if ($("#small_img_container").children().length==0){
        $("#expand_img_more").css("display","none");
        $("#expand_img_less").css("display","none");
    }
    else{
        $("#expand_img_more").removeAttr("style");
        $("#expand_img_less").removeAttr("style");
    };
};

// Preview expand btn
function preview_expand_btn(key){
    let all_img = $("#small_img_container").children();
    let selector =  $("#small_img_container div[style*='border: 2px solid rgb(230, 31, 35);']");
    let show_img = selector[0];
    // Get index of show image 
    let index = null;
    for (let idx = 0;idx < all_img.length; idx++){
        if (all_img[idx]==show_img){
            index = idx
        };
    };
    // Expand action
    if (key=="more"){
        if (index!=all_img.length-1){
            let next = all_img[index+1]
            select_img($(next).children()[0]);
            // Append css
            $(next).css("border","2px solid #E61F23").ready(function(){
                // Remove select div
                remove_select_img();
            });
        };
    }
    else{
        if (index!=0){
            let before = all_img[index-1];
            select_img($(before).children()[0]);
            // Append css
            $(before).css("border","2px solid #E61F23").ready(function(){
                // Remove select div
                remove_select_img(1);
            });
        };
    };
};

// Every image show class
function img_show_class(src){
    let path = src.split("display_img/")[1]
    let cls_info = get_img_cls_api(TYPE_NAME, path);
    // Append html
    for (let class_name of Object.keys(cls_info)){
        // class_name != Unlabeled
        if (class_name != "Unlabeled" & class_name != ""){
            // Dataset Preview page
            if (!($("#label_div").children().length>0)){
                append_img_show_cls(class_name, cls_info[class_name], "img_cls_show_container");
            }
            else{
                // Label page
                add_annotation(class_name);
            };
        };
    };
};

// Remove old html in img_cls_show_container
function remove_img_cls(){
    if (!($("#label_div").children().length>0)){
        // Dataset Preview page
        if ($("#img_cls_show_container").children().length>0){
            $("#img_cls_show_container").children().remove();
        };
    }
    else{
        // Label page
        if ($("#annotation").children().length>0){
            $("#annotation").children().remove();
        };
    };
};

// Parent append html (img_show_class)
function append_img_show_cls(class_name, num, parent){
    // Give color to left side
    if (TYPE_NAME == "object_detection"){
        COLOR_BAR = get_color_bar_api();
        // Get index of all classes
        cls_idx = Object.keys(ALL_CLASSES_API["classes_num"]).indexOf(class_name);
        cls_idx = parseInt(cls_idx+1);
        color = COLOR_BAR[parseInt(cls_idx)]
        style = `border-left: 3px solid ${color};`;
    }
    else{
        style = "border-left: 3px solid #000;";
    };
    // Append class tag
    let html = `
                <div class="img_cls_show_tag img_cls_show_tag_css" style='${style}'>
                    <div id="img_${class_name}" class="img_cls_txt text-truncate user-select-none">${class_name}</div>
                    <div class="img_cls_num">${num}</div>
                </div>
                `
    $(`#${parent}`).append(html).ready(function(){
        hover_marquee(`img_${class_name}`);
    });
};

// Show object detection box
function show_box(event, img_name){
    // Get img and panel size
    const panel_w = event.width;
    const panel_h = event.height;
    const org_w = event.naturalWidth;
    const org_h = event.naturalHeight;

    IMAGE_SIZE["small_panel"]=[panel_h, panel_w]
    IMAGE_SIZE["org"]=[org_w, org_h]

    // Remove exist pannel
    if ($("#draw").length>0){
        $("#draw").remove();
    };

    // Append svg to panel
    let svg_html= `
                    <svg id="draw" class="show_image" width=${panel_w} height=${panel_h} viewBox="0 0 ${panel_w} ${panel_h}" xmlns="http://www.w3.org/2000/svg" onmousemove="move(evt)" onmouseup="end_move(evt)" onmouseout="end_move(evt)">
                        <rect id="rect_marquee" x="-100" y="-100" width="0" height="0" />
                        <g id="boxes"></g>
                    </svg>
                `;

    if ($("#draw").length == 0){
        if (!($("#label_div").children().length>0)){
            // Dataset svg
            $(".preview_img_container").append(svg_html);
        }
        else{
            // Label svg
            $("#show_large_img").append(svg_html);
            // Loading panel action
            // // Listen change panel
            // listen_draw();
            // Preset function
            if (Object.keys(POINTCOLOR).length==0){
                point();
            };
        };
    };
    
    // Get box
    COLOR_BAR = get_color_bar_api();
    if (MAIN_PAGE=="dataset"){
        let src_split = event["src"].split("display_img")
        let front_param = {"image_path":`${src_split[src_split.length-1]}`};
        let box_info = get_bbox_api(MAIN_UUID, front_param);
        if (box_info["box_info"] != 0){
            // Draw box
            init_draw_box(box_info["box_info"]);
        };
    }
    else{
        filter_eval(img_name);
    };
    // DOM elements
    document.getElementById("rect_marquee").classList.add('hide');
};