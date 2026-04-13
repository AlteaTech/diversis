<?php
namespace App\Utils;


class Utils
{
	function _crypt($input)
	{
		return  password_hash($input, PASSWORD_BCRYPT, ['memory_cost' => 2048, 'time_cost' => 4, 'threads' => 3]);
	}

	function better_crypt($input, $rounds = 7)
	{
		$salt = "";
		$salt_chars = array_merge(range('A','Z'), range('a','z'), range(0,9));
		for($i=0; $i < 22; $i++) {
			$salt .= $salt_chars[array_rand($salt_chars)];
		}
		return crypt($input, sprintf('$2a$%02d$', $rounds) . $salt);
	}

	function delete_col(&$array, $key) {
		unset($array[$key]);
	}
	
}

