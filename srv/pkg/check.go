package pkg

import "regexp"

func IsValidId(id string) bool {
	re := regexp.MustCompile(`^[a-z0-9]+$`)
	return re.MatchString(id)
}
