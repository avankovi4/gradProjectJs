logic = (function() {

    var WALL = 0;
    var OPEN = 1;


    var
        matrix_empty,

        score,

        cols,
        rows ,
        len,
        blank ,
        balls_color_no,
        balls_init_no,
        balls_next_no_variety,
        balls_next_no;


    function getScore(){
        return score;
    }

    function init( conf_action ){
        score =  conf_action.score;

        cols = conf_action.cols;
        rows = conf_action.rows;
        len = conf_action.len;
        blank =  conf_action.blank;
        balls_color_no =  conf_action.balls_color_no;
        balls_init_no = conf_action.balls_init_no;
        balls_next_no = conf_action.balls_next_no;
        balls_next_no_variety = conf_action.balls_next_no_variety;
    }


    function transformMatrix( matrix_in ){

        var matrix_out = [];
        for (var x=0;x<cols;x++) {
            matrix_out[x] = [];
            for (var y=0;y<rows;y++) {
                if( matrix_in[x][y] == blank  ){
                    matrix_out[x][y] = OPEN;
                }else{
                    matrix_out[x][y] = WALL;
                }
            }
        }
        return matrix_out;
    }

    function getEmptyMatrix(){

        var matrix_empty = [];
        for (var x=0;x<cols;x++) {
            matrix_empty[x] = [];
            for (var y=0;y<rows;y++) {
                matrix_empty[x][y] = blank;
            }
        }

        return matrix_empty;
    }

    function  getRandomMatrix( matrix_in, balls_no ){
        var  matrix_out = getEmptyMatrix();
        var points_empty_arr = getEmptyPoint( matrix_in  );

        var random_no = (points_empty_arr.length < balls_no) ? points_empty_arr.length :  balls_no;


        if( random_no == 0 ){
            return false;
        }

        for (var x=0;x<random_no;x++ ){
            var random_el = delRandElFromArr( points_empty_arr );

            var point_no = random_el[1][0];

            var xy =  pointToMatrix(  point_no  );
            matrix_out[xy.x][xy.y] = randomColor();

            var points_empty_arr =  random_el[0];
        }
        return  matrix_out;
    }

    function getRandomPointFromMatrix( matrix_in  ){

        var points_empty_arr = getEmptyPoint( matrix_in );
        var random_el = delRandElFromArr( points_empty_arr );
        var point_no = random_el[1][0];
        var xy =  pointToMatrix(  point_no  );
        return xy;
    }

    function copyMarix( matrix ){
        var out = [];
        for (var x=0;x<cols;x++) {
            out[x] = [];
            for (var y=0;y<rows;y++) {
                out[x][y] = matrix[x][y];
            }
        }
        return out;
    }


    function delRandElFromArr(arr ){
        var ri = Math.floor(Math.random() * arr.length);
        var rs =  arr.splice( ri , 1 );
        var out = [];
        out[0] = arr;
        out[1] = rs;

        return out;
    }

    function getEmptyPoint( matrix  ){
        var points_empty = [];
        var i = 0;
        var point_no = 0;
        for (var y=0;y<rows;y++) {
            for (var x=0;x<cols;x++) {
                if(matrix[x][y] == blank){
                    points_empty[i] = point_no  ;
                    i++;
                }
                point_no++;
            }
        }
        return points_empty;
    }


    function sumMatrix( m_rand, m_next ){
        var m_tmp = copyMarix( m_rand );


        var count_next = 0;
        for (var x=0;x<cols;x++) {
            for (var y=0;y<rows;y++) {
                if( (m_rand[x][y] == blank) && ( m_next[x][y] !=  blank )  ){
                    m_tmp[x][y] = m_next[x][y];
                    count_next++;
                }
            }
        }

        var balls_next_no_tmp = getBallsNextNo();

        if( count_next <  balls_next_no_tmp  ){

            var xy = getRandomPointFromMatrix( m_tmp  );
            m_tmp[xy.x][xy.y] = randomColor();
        }
        return m_tmp;
    }

    function getBallsNextNo(){
      if(!balls_next_no_variety){
        return balls_next_no;
      }

      var isOdd = (counter % balls_next_no_variety) ? 0 : 1;
      return balls_next_no + isOdd;
    }


    function randomColor(){
        return Math.floor(Math.random() *  balls_color_no  );
    }

    function pointToMatrix( point  ){
        var y = Math.floor( point/rows );
        var x = (point  % cols);
        return { 'x':x, 'y':y  };
    }

    function getEvalEntity( matrix ){
        var k = 0;
        var eval_entity = [];
        for (var x=0;x<cols;x++) {
            for (var y=0;y<rows;y++) {
                if(  x <= (cols - len)  ){
                    eval_entity[k] =[];
                    for( i=0; i<len; i++  ){
                        eval_entity[k][i] = {};
                        eval_entity[k][i].x = x+i;
                        eval_entity[k][i].y = y;
                        eval_entity[k][i].v = matrix[x+i][y];
                    }
                    k++
                }
                if(  y <= (rows - len)  ){
                    eval_entity[k] =[];
                    for( i=0; i<len; i++  ){
                        eval_entity[k][i] = {};
                        eval_entity[k][i].x = x;
                        eval_entity[k][i].y = y+i;
                        eval_entity[k][i].v = matrix[x][y+i];
                    }
                    k++;
                }
                if(  (x <= (cols - len)) && (  y <= (rows - len)  )  ){
                    eval_entity[k] =[];
                    for( i=0; i<len; i++  ){
                        eval_entity[k][i] = {};
                        eval_entity[k][i].x = x+i;
                        eval_entity[k][i].y = y+i;
                        eval_entity[k][i].v = matrix[x+i][y+i];
                    }
                    k++;

                    eval_entity[k] =[];
                    for( i=0; i<len; i++  ){
                        eval_entity[k][i] = {};
                        eval_entity[k][i].x = x+len-1-i;
                        eval_entity[k][i].y = y+i;
                        eval_entity[k][i].v = matrix[x+ len-1-i][y+i];
                    }
                    k++;
                }
            }
        }
        return eval_entity;
    }

    function uniqueArray( haystack) {
        var length = haystack.length;
        var err = 0;
        for(var i = 0; i < length-1; i++) {
            if(haystack[i].v == blank){
                err = 1;
                break;
            }else if( haystack[i].v !=  haystack[i+1].v ){
                err = 1;
                break;
            }
        }
        if( err == 1  ){
            return false;
        }

        return haystack[0].v;
    }


    function getFilterMatch( matrix_in  ){

        var eval_entity =getEvalEntity( matrix_in );
        matrix_ball_to_del = getEmptyMatrix();

        var find = false;
        for( i=0; i<eval_entity.length; i++  ){
            var item = eval_entity[i];
            var color = uniqueArray( item );
            if(  color !==  false ){

                find = true;
                score += len;
                for( j=0; j<item.length; j++ ){
                    matrix_ball_to_del[item[j].x][item[j].y] = color;
                }
            }
        }
        if( find == false  ){
            return false;
        }

        return matrix_ball_to_del;
    }

    function delBall( m_from, m_del ){
        var m_out = copyMarix( m_from );

        for (var x=0;x<cols;x++) {
            for (var y=0;y<rows;y++) {
                if( m_del[x][y] != blank ){
                    m_out[x][y] = blank;
                }
            }
        }
        return m_out;
    }


    return {
        getRandomMatrix : getRandomMatrix,
        getEmptyMatrix : getEmptyMatrix,
        sumMatrix : sumMatrix,
        getFilterMatch : getFilterMatch,
        getScore :  getScore,
        delBall : delBall,
        transformMatrix : transformMatrix,
        copyMarix :  copyMarix,
        getBallsNextNo: getBallsNextNo,
        init : init
    };

})();
